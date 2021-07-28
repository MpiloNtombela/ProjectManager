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
    alpha: {
      5: "0D",
      10: "1A",
      20: "33",
      30: "4D",
      40: "66",
      50: "80",
      60: "99",
      70: "B3",
      80: "CC",
      90: "E6",
      100: "FF",
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
