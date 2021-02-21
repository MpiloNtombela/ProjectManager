import createMuiTheme from "@material-ui/core/styles/createMuiTheme";

const theme = createMuiTheme({
  palette: {
    // mode: 'dark',
    primary: {
      main: '#1e90ff'
      // main: '#86087a'
    },
    secondary: {
      main: '#20BF55'
    },
    primaryRGBA: {
      main: 'rgba(30,144,255,0.7)'
    },
    secondaryRGBA: {
      main: 'rgba(193,12,255,0.7)'
    },
    glass: {
      light: 'rgba(255,255,255,0.3)',
      dark: 'rgba(0,0,0,0.3)'
    }
  },
  shape: {
    // borderRadius: 12
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 9999
        }
      }
    }
  }
})

export default theme