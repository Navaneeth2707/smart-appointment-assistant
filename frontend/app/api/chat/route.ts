import { NextRequest, NextResponse } from "next/server";
import groq from "@/lib/groq";
import { tools } from "@/lib/tools";
import {
  getServices,
  createAppointment,
  getAppointments,
  checkSlotAvailability,
} from "@/lib/payload";

function getSystemPrompt(servicesListString: string, currentDateStr: string) {
  return `You are AI Doctor, an AI assistant for AI Clinic.
Your job is to help users book appointments.

Today's current date and time is: ${currentDateStr}.
Use this as the reference point to calculate relative dates/times (such as "today", "tomorrow", "next Monday at 3 PM", etc.).

Here is the STRICT list of official clinic services we offer:
${servicesListString}

Follow this exact step-by-step workflow to collect details and schedule appointments:
1. Greet the user and ask for their name if you don't know it yet.
2. Once you have their name, ask for their phone number.
3. Once you have their phone number, ask them to choose one of our official services listed above.
4. Once they select a service, ask for their preferred appointment date and time.
5. ONLY after you have collected all 4 pieces of information (Name, Phone Number, Service, and Date/Time) from the user, follow these steps:
   a. First, call 'checkAvailability' using the provided date and time.
   b. If the slot is available, call 'createAppointment' to book the appointment.
   c. If the slot is not available, inform the user and ask them to select a different date/time.

Strict Rules:
- Ask only ONE question at a time. Keep your messages concise, friendly, and professional.
- Do NOT call 'createAppointment' or 'checkAvailability' if any of the required parameters are missing or empty. If a parameter is missing, you must ask the user for it in a message.
- You must get explicit input from the user for the date and time. Do NOT assume, guess, or default the date and time under any circumstances.
- If the user specifies a date but not a time (e.g. 'tomorrow'), you must ask them to select a specific time between 9:00 AM and 5:00 PM.
- Once the appointment is successfully created, summarize the details for the user and confirm the booking.`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    const servicesData = await getServices();
    const serviceNames = (servicesData.docs || []).map((s: any) => s.name);
    const servicesListString = serviceNames.length > 0
      ? serviceNames.map((name: string) => `- ${name}`).join("\n")
      : "- Teeth Whitening\n- Consultation\n- Dental Implants\n- Crowns and Bridges\n- Dentures\n- Fillings\n- Root Canals";

    const currentDateStr = new Date().toLocaleString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZoneName: "short"
    });

    const systemPrompt = getSystemPrompt(servicesListString, currentDateStr);

    const configuredModel = process.env.GROQ_MODEL || "";
    const model = configuredModel.startsWith("openai/") || !configuredModel
      ? "llama-3.3-70b-versatile"
      : configuredModel;

    let chatMessages: any[] = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...messages,
    ];

    let loopLimit = 5;
    let bookingSucceeded = false;

    while (loopLimit > 0) {
      const response = await groq.chat.completions.create({
        model,
        messages: chatMessages,
        tools,
        tool_choice: "auto",
      });

      const assistant = response.choices[0].message;

      // Append assistant's response to keep context
      chatMessages.push(assistant);

      if (!assistant.tool_calls || assistant.tool_calls.length === 0) {
        return NextResponse.json({
          reply: assistant.content || "Appointment processing complete.",
          bookingSucceeded,
        });
      }

      let toolResults: any[] = [];

      for (const toolCall of assistant.tool_calls) {
        const name = toolCall.function.name;
        let args: any = {};
        try {
          args = JSON.parse(toolCall.function.arguments);
        } catch (e) {
          console.error("Failed to parse tool arguments:", e);
        }

        try {
          switch (name) {
            case "getServices": {
              const services = await getServices();

              toolResults.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name,
                content: JSON.stringify(services),
              });

              break;
            }

            case "getAppointments": {
              const appointments = await getAppointments();

              toolResults.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name,
                content: JSON.stringify(appointments),
              });

              break;
            }

            case "checkAvailability": {
              if (!args.appointmentDate || args.appointmentDate.includes("current")) {
                toolResults.push({
                  tool_call_id: toolCall.id,
                  role: "tool",
                  name,
                  content: JSON.stringify({
                    error: "Invalid or missing appointmentDate. Please ask the user for a specific date and time.",
                  }),
                });
                break;
              }

              const availability = await checkSlotAvailability(args.appointmentDate);

              toolResults.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name,
                content: JSON.stringify(availability),
              });

              break;
            }

            case "createAppointment": {
              const serviceName = args.serviceName || args.selectedService;
              if (!args.patientName || !args.phoneNumber || !serviceName || !args.appointmentDate) {
                toolResults.push({
                  tool_call_id: toolCall.id,
                  role: "tool",
                  name,
                  content: JSON.stringify({
                    error: "Missing required details. You must ask the user for their name, phone, service, and date/time before booking.",
                  }),
                });
                break;
              }

              const appointment = await createAppointment({
                patientName: args.patientName,
                phoneNumber: args.phoneNumber,
                serviceName: serviceName,
                appointmentDate: args.appointmentDate,
              });

              toolResults.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name,
                content: JSON.stringify(appointment),
              });

              bookingSucceeded = true;
              break;
            }
          }
        } catch (toolError: any) {
          console.error(`Error executing tool '${name}':`, toolError);
          toolResults.push({
            tool_call_id: toolCall.id,
            role: "tool",
            name,
            content: JSON.stringify({
              error: toolError.message || `Failed to execute tool ${name}.`,
            }),
          });
        }
      }

      chatMessages.push(...toolResults);
      loopLimit--;
    }

    return NextResponse.json({
      reply: "I am processing your booking, but it is taking longer than expected. Please check your appointments list.",
      bookingSucceeded,
    });
  } catch (error) {
    console.error("Error in Chat API Route:", error);

    return NextResponse.json(
      {
        reply: "Sorry, something went wrong while processing your request. Please try again.",
      },
      {
        status: 500,
      }
    );
  }
}