const API = process.env.PAYLOAD_API!;

async function request(url: string, options?: RequestInit) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options?.headers || {}),
      },
      cache: "no-store",
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      const text = await res.text();
      throw new Error(text);
    }

    return res.json();
  } catch (error: any) {
    clearTimeout(timeoutId);
    if (error.name === "AbortError") {
      throw new Error(`Request to backend API timed out (URL: ${url})`);
    }
    throw error;
  }
}

/*
--------------------------------
Get All Services
--------------------------------
*/
export async function getServices() {
  return request(`${API}/services?limit=100`);
}

/*
--------------------------------
Get All Appointments
--------------------------------
*/
export async function getAppointments() {
  return request(`${API}/appointments?limit=100`);
}

/*
--------------------------------
Find Service By Name
--------------------------------
*/
export async function findServiceByName(
  serviceName: string
) {
  console.log("[PAYLOAD API Client] findServiceByName searching for:", serviceName);
  const services = await getServices();
  console.log("[PAYLOAD API Client] getServices docs list:", services.docs);

  const service = services.docs.find(
    (item: { name: string }) =>
      item.name.toLowerCase().trim() ===
      serviceName.toLowerCase().trim()
  );

  if (!service) {
    throw new Error(
      `Service '${serviceName}' not found`
    );
  }

  return service;
}

/*
--------------------------------
Create Appointment
--------------------------------
*/
export async function createAppointment(data: {
  patientName: string;
  phoneNumber: string;
  serviceName: string;
  appointmentDate: string;
}) {
  console.log("[PAYLOAD API Client] createAppointment called with:", data);
  const service = await findServiceByName(
    data.serviceName
  );
  console.log("[PAYLOAD API Client] findServiceByName returned:", service);

  const body = {
    patientName: data.patientName,
    phoneNumber: data.phoneNumber,
    serviceName: service.id || service._id,
    appointmentDate: data.appointmentDate,
  };
  console.log("[PAYLOAD API Client] Sending request to backend with body:", body);

  return request(`${API}/appointments`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

/*
--------------------------------
Check Slot Availability
--------------------------------
*/
export async function checkSlotAvailability(targetDateStr: string, timezone?: string) {
  try {
    const appointments = await getAppointments();
    const targetTime = new Date(targetDateStr).getTime();
    
    if (isNaN(targetTime)) {
      return { available: false, error: "Invalid date format. Please use ISO-8601 format." };
    }

    // 30 minutes in milliseconds
    const SLOT_DURATION_MS = 30 * 60 * 1000;

    for (const appt of appointments.docs || []) {
      const apptTime = new Date(appt.appointmentDate).getTime();
      if (isNaN(apptTime)) continue;

      // Check if the difference is less than 30 minutes
      if (Math.abs(targetTime - apptTime) < SLOT_DURATION_MS) {
        const formattedDate = timezone 
          ? new Date(appt.appointmentDate).toLocaleString("en-US", { timeZone: timezone })
          : new Date(appt.appointmentDate).toLocaleString();

        return { 
          available: false, 
          error: `Slot is already booked at ${formattedDate}` 
        };
      }
    }

    return { available: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Failed to check availability";
    return { available: false, error: errorMessage };
  }
}