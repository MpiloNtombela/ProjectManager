import React from "react";
import Box from "@material-ui/core/Box";
import Button from "@material-ui/core/Button";

export const FormSubmitButton = ({children, ...props}) => (
    <Box sx={{my: 2}}>
        <Button type="submit" fullWidth color="primary" variant="contained" {...props}>
            {children}
        </Button>
    </Box>
)