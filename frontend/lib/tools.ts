export const tools = [
  {
    type: "function",
    function: {
      name: "getServices",
      description:
        "Get all available dental services from the database.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "getAppointments",
      description:
        "Get all appointments. Use this if you want to check booked time slots.",
      parameters: {
        type: "object",
        properties: {},
        required: [],
      },
    },
  },

  {
    type: "function",
    function: {
      name: "createAppointment",
      description:
        "Create a new appointment after collecting all required information. ONLY call this when the user has explicitly stated they want to book, and has explicitly provided their name, phone number, service name, and date/time.",
      parameters: {
        type: "object",
        properties: {
          patientName: {
            type: "string",
            description: "Patient's full name",
          },

          phoneNumber: {
            type: "string",
            description: "Patient phone number",
          },

          serviceName: {
            type: "string",
            description:
              "Service selected by the patient. Example: Teeth Whitening",
          },

          appointmentDate: {
            type: "string",
            description:
              "Appointment date and time in ISO-8601 format",
          },
        },

        required: [
          "patientName",
          "phoneNumber",
          "serviceName",
          "appointmentDate",
        ],
      },
    },
  },
  {
    type: "function",
    function: {
      name: "checkAvailability",
      description:
        "Check if a specific date and time slot is available for an appointment. ONLY call this when the user has explicitly suggested or selected a specific date and time slot. Do NOT call this if the user has not specified a date and time.",
      parameters: {
        type: "object",
        properties: {
          appointmentDate: {
            type: "string",
            description:
              "The proposed date and time in ISO-8651 format (e.g. 2026-07-04T10:00:00.000Z)",
          },
        },
        required: ["appointmentDate"],
      },
    },
  },
];