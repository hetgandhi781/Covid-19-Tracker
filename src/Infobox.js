import React from 'react'
import {Card,CardContent,Typography} from "@material-ui/core";
import "./Infobox.css";
function Infobox({isRed,isBlue,isGreen,active,title,cases,total,...props}) {
    return (
        <Card onClick={props.onClick} className={`infobox ${active && "infobox--selected"} ${isRed &&"infobox--red"} ${isGreen && "infobox--green"} ${isBlue && "infobox--blue"} `}>
            <CardContent>
            <Typography className="infobox__title" color="textSecondary">
                {title}
            </Typography>
            
            <h2 className={`infobox__cases ${!isRed && !isBlue && "infobox--cases--green"} ${!isGreen && !isBlue && "infobox--cases--red"} ${!isRed && !isGreen && "infobox--cases--blue"} `}>{cases}</h2>

            <Typography className="infobox__total" color="textSecondary">
                {total} Total
            </Typography>

            </CardContent>
        </Card>
    )
}

export default Infobox
