import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import PlayIcon from '@material-ui/icons/PlayArrow';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
}));

export default function ListComponent(props) {
  const classes = useStyles();

  return (
    <List component="nav" className={classes.root}>
      { props.podcasts.map((podcast, index) => {
            return (
              <ListItem key={ podcast.id + index } button component="a" href={ podcast.url }>
                   <ListItemIcon>
                       <PlayIcon />
                  </ListItemIcon>
                  <ListItemText primary={ podcast.title } secondary={ podcast.description } />
              </ListItem> 
            ) 
        }) 
      }
    </List>
  );
}