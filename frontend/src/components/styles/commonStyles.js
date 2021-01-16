import makeStyles from "@material-ui/core/styles/makeStyles";

const useCommonStyles = makeStyles(() => ({
    centered: {
        display  : "block",
        textAlign: "center"
    },
}));

export const useSpacingStyles = makeStyles(() => ({
    noPadding : {
        padding: 0,
    },
    noPaddingY: {
        paddingTop   : 0,
        paddingBottom: 0
    },
    noPaddingX: {
        paddingLeft : 0,
        paddingRight: 0
    },
    noMargin  : {
        margin: 0,
    },
    noMarginY : {
        marginTop   : 0,
        marginBottom: 0
    },
    noMarginX : {
        marginLeft : 0,
        marginRight: 0
    },


}))

export default useCommonStyles