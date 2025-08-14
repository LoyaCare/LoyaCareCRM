import React, { useState, useEffect } from "react";
import { Button, Stack, IconButton, Typography, Box, Divider } from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { AppointmentFormFields } from "./AppointmentFormFields";
import { 
  AppointmentExt, 
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "../model/types";

type AppointmentsFormFieldsSetProps = {
  initialAppointments?: AppointmentExt[];
  onChange?: (appointments: (CreateAppointmentDTO | UpdateAppointmentDTO)[]) => void;
};

export const AppointmentsFormFieldsSet: React.FC<AppointmentsFormFieldsSetProps> = ({
  initialAppointments = [],
  onChange,
}) => {
  const [appointments, setAppointments] = useState<(CreateAppointmentDTO | UpdateAppointmentDTO)[]>(
    initialAppointments
  );

  useEffect(() => {
    onChange?.(appointments);
    console.log("Appointments changed:", appointments); 
  }, [appointments, onChange]);

  const handleAdd = () => {
    setAppointments((prev) => [
      ...prev,
      {
        datetime: undefined,
        type: undefined,
        note: undefined,
        dealId: undefined,
      },
    ]);
  };

  const handleRemove = (idx: number) => {
    setAppointments((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleChange = (idx: number, value: CreateAppointmentDTO | UpdateAppointmentDTO) => {
    setAppointments((prev) => 
      prev.map((item, i) => i === idx ? value : item)
    );
  };

  return (
    <Stack spacing={1.5}>
      {appointments.map((appointment, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <Divider sx={{ my: 2 }} />}
          <Stack 
            direction="row" 
            alignItems="flex-start" 
            spacing={1}
            sx={{ "& .MuiTextField-root": { my: 0.5 } }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <AppointmentFormFields
                initialData={appointment as AppointmentExt || undefined}
                onSubmit={(value) => handleChange(idx, value)}
              />
            </Box>
            <IconButton
              aria-label="Delete appointment"
              color="error"
              onClick={() => handleRemove(idx)}
              sx={{ mt: 1 }}
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </React.Fragment>
      ))}
      <Button
        variant="outlined"
        size="small"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{ alignSelf: "flex-start", mt: 1 }}
      >
        Add Appointment
      </Button>
    </Stack>
  );
};