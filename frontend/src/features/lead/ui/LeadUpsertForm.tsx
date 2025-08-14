import React, { useState, useEffect } from "react";
import {
  TextField,
  Button,
  Stack,
  Paper,
  Typography,
  Box,
} from "@mui/material";
import {
  LeadExt,
  CreateLeadDTO,
  UpdateLeadDTO,
} from "@/entities/lead/model/types";
import {
  AppointmentExt,
  CreateAppointmentDTO,
  UpdateAppointmentDTO,
} from "@/entities/appointment/model/types";
import { ContactFormFields } from "@/entities/contact/ui/ContactFormFields";
import { useGetLeadByIdQuery } from "@/entities/lead/model/api";
import { AppointmentsFormFieldsSet } from "@/entities/appointment/ui/AppointmentsFormFieldsSet";
import {
  CreateContactDTO,
  UpdateContactDTO,
} from "@/entities/contact/model/types";

type LeadFormProps = {
  initialData?: LeadExt;
  leadId?: string;
  onSubmit?: (form: CreateLeadDTO | UpdateLeadDTO, shouldCreate?: boolean) => void;
};

export const LeadUpsertForm: React.FC<LeadFormProps> = ({
  initialData,
  leadId,
  onSubmit,
}) => {

  const isNewLead = !leadId && !initialData;
  const skipFetch = !!initialData || !initialData && !leadId;

  const {
    data: leadData = initialData,
    isLoading,
    isError,
  } = useGetLeadByIdQuery(leadId || "", {
    skip: skipFetch,
  });

  const [form, setForm] = useState<CreateLeadDTO | UpdateLeadDTO>(
    initialData as CreateLeadDTO | UpdateLeadDTO
  );

  useEffect(() => {
    if (leadData && !initialData) {
      setForm(leadData);
    }
  }, [leadData, initialData]);

  useEffect(() => {   
    console.log("Form updated:", form);
  }, [form]);
  
  const handleChange = React.useCallback(
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      const value =
        e.target.name === "potentialValue"
          ? Number(e.target.value) || null
          : e.target.value;

      setForm((prev) => ({
        ...prev,
        [e.target.name]: value,
      }));
    },
    [setForm]
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.(form, isNewLead);
  };

 
  const handleAppointmentsChange = React.useCallback(
    (newAppointments: (CreateAppointmentDTO | UpdateAppointmentDTO)[]) => {
      setForm((prev) => ({
        ...prev,
        appointments: newAppointments as any[],
      }));
    },
    [setForm]
  );

  const handleContactChange = React.useCallback(
    (contactData: CreateContactDTO | UpdateContactDTO) => {
      setForm((prev) => ({
        ...prev,
        contact: contactData as any,
      }));
    },
    [setForm]
  );
  
 if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading lead data</div>;
  }

  return (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      <form
        onSubmit={handleSubmit}
        style={{ height: "100%", display: "flex", flexDirection: "column" }}
      >
        <Box sx={{ flex: 1, overflowY: "auto", px: 1 }}>
          <Stack spacing={2}>
            {/* Lead Basic Information */}
            <Paper elevation={0} sx={{ bgcolor: "background.default" }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "primary.main", fontWeight: 600 }}
                >
                  Lead Information
                </Typography>
                <Stack direction="row" spacing={1.5}>
                  <TextField
                    fullWidth
                    label="Product"
                    name="productInterest"
                    value={form?.productInterest || ""}
                    onChange={handleChange}
                    placeholder="Product Interest"
                    variant="outlined"
                    size="small"
                  />
                  <TextField
                    fullWidth
                    label="Wert"
                    name="potentialValue"
                    type="number"
                    value={form?.potentialValue || ""}
                    onChange={handleChange}
                    placeholder="Potential Value"
                    variant="outlined"
                    size="small"
                  />
                </Stack>
              </Stack>
            </Paper>

            {/* Contact Section */}
            <Paper elevation={0} sx={{ bgcolor: "background.default" }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "primary.main", fontWeight: 600 }}
                >
                  Contact Information
                </Typography>
                <Box sx={{ "& .MuiTextField-root": { my: 0.5 } }}>
                  <ContactFormFields
                    initialData={form?.contact}
                    contactId={form?.contact?.id}
                    onChange={handleContactChange}
                  />
                </Box>
              </Stack>
            </Paper>

            {/* Appointments Section */}
            <Paper elevation={0} sx={{ bgcolor: "background.default" }}>
              <Stack spacing={1.5}>
                <Typography
                  variant="subtitle1"
                  sx={{ color: "primary.main", fontWeight: 600 }}
                >
                  Appointments
                </Typography>
                <Box sx={{ "& .MuiTextField-root": { my: 0.5 } }}>
                  <AppointmentsFormFieldsSet
                    initialAppointments={form?.appointments as AppointmentExt[]}
                    onChange={handleAppointmentsChange}
                  />
                </Box>
              </Stack>
            </Paper>
          </Stack>
        </Box>
        <Box
          sx={{
            position: "sticky",
            bottom: 0,
            bgcolor: "background.default",
            paddingTop: 2,
            paddingLeft: 2,
            paddingRight: 2,
            mt: "auto",
          }}
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="medium"
            fullWidth
            sx={{
              py: 1,
              textTransform: "none",
              fontWeight: 600,
            }}
          >
            {isNewLead ? "Create Lead" : "Update Lead"}
          </Button>
        </Box>
      </form>
    </Box>
  );
};
