import {
  Prisma,
  Appointment,
  AppointmentType,
} from "@/shared/generated/prisma-client";

type AppointmentExt = Prisma.AppointmentGetPayload<{
  include: { deal: true };
}>;

export type { Appointment, AppointmentExt, AppointmentType };
export const appointmentTypes = Object.values(AppointmentType); 
export type CreateAppointmentDTO = Omit<AppointmentExt, "id">;
export type UpdateAppointmentDTO = Partial<CreateAppointmentDTO>;
