import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#1e90ff",
      // main: '#86087a'
    },
    secondary: {
      main: "#9400D3",
    },
  },
  shape: {
    // borderRadius: 12
  },
  sizing: {
    toolbarHeight: 48,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999,
        },
      },
    },
  },
});

export default theme;
