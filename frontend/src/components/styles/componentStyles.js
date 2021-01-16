import makeStyles from "@material-ui/core/styles/makeStyles";

export const useComponentStyles = makeStyles((theme) => ({
    paper     : {
        paddingTop   : theme.spacing(8),
        display      : 'flex',
        flexDirection: 'column',
        alignItems   : 'center',
        textItems    : 'center',
        paddingBottom: theme.spacing(10)
    },
    form      : {
        width    : '100%', // Fix IE11 issue.
        marginTop: theme.spacing(1),
    },
    submit    : {
        marginTop   : theme.spacing(2),
        marginBottom: theme.spacing(2),
    },
    link      : {
        marginTop     : theme.spacing(2),
        fontSize      : "small",
        fontWeight    : 600,
        display       : "inline-block",
        color         : theme.palette.secondary.main,
        textDecoration: "none",
    },
    rememberMe: {
        fontSize: "small",
        margin  : theme.spacing(2, 0),
        marginLeft  : theme.spacing(0)
    }
}));