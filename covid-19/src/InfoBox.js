import React from 'react'
import { Card, CardContent,Typography, } from '@material-ui/core'
import './InfoBox.css'

function InfoBox({title, cases, totaltitle, isRed, active, total, ...props}) {
    return (
        <div className="InfoBox">
        <Card onClick={props.onClick}
                  className={`infoBox ${active && 'infoBox--selected'}
                  ${isRed && 'infoBox--red'} `}
            >
           <CardContent >
           <Typography className="InfoBox__title" color="textSecondary">
           {title}
           </Typography>
           <Typography className="InfoBox__cases" color="textSecondary">
           <strong>{cases}</strong>
           </Typography>
           <Typography className="InfoBox__total" color="textSecondary">
           {total} Total
           </Typography>
           </CardContent>
            
        </Card>
    </div>
    )
}

export default InfoBox
