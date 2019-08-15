import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemIcon';
import PlayIcon from '@material-ui/icons/Mic';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
    backgroundColor: theme.palette.background.paper,
    paddingBottom: 100,
  },
}));

export default function ListComponent(props) {
  const classes = useStyles();

  const onSelectPodcast = (index) => {
    props.onSelect(index);

  }

  const getProgress = (id, duration) => {
    const cachedBookmark = localStorage.getItem(`bookmark-${id}`);

    if(cachedBookmark) {
      const bookmark = JSON.parse(cachedBookmark);
      
      return parseFloat((bookmark.time / (duration / 1000)) * 100);
    }

    return 0;
  }

  return (
    <List component="nav" className={classes.root}>
      { props.podcasts.map((podcast, index) => {
            return (
              <ListItem selected={props.activePodcastNumber === index} key={ podcast.id + "" + index } button onClick={ () => onSelectPodcast(index) } value={index}>
                   <ListItemIcon>
                       <PlayIcon />
                  </ListItemIcon>
                  <ListItemText primary={ podcast.title } secondary={ podcast.description } />
                  { getProgress(podcast.id, podcast.duration) ? <ListItemSecondaryAction>
                    <LinearProgress variant="determinate" value={ getProgress(podcast.id, podcast.duration) } style={{ width: 50 }} /> 
                  </ListItemSecondaryAction> : '' }
              </ListItem> 
            ) 
        }) 
      }
    </List>
  );
}