import React, { Component } from 'react';
import { EMPTY } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { expand, reduce } from 'rxjs/operators';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import HeaderComponent from './Components/Header.js';
import ListComponent from './Components/List.js';
import PlayerComponent from './Components/Player.js';

import './App.css';

const theme = createMuiTheme({
  palette: {
    type: 'dark',
  },
});

const podcastUrl = 'https://api.p4.no/1/data/lydklipp';
const sectionId = 432;

class App extends Component {
  state = {
    podcasts: [],
    isPlaying: false,
    activePodcastNumber: null,
    activePodcast: null,
    activePodcastUrl: ''
  }

  componentDidMount() {
    this.getAllPodcasts(sectionId).subscribe((data) => this.setState({ podcasts: data.reverse() }));
  }

  getPodcasts(sectionId, pageNumber) {
    return ajax.getJSON(podcastUrl + '?sectionId=' + sectionId + '&pageNumber=' + pageNumber);
  }

  getAllPodcasts(sectionId) {
    let pageNumber = 1;

    return this.getPodcasts(sectionId, pageNumber).pipe(
      expand((value) => {
        return value.length > 0 ? this.getPodcasts(sectionId, pageNumber++) : EMPTY;
      }),
      reduce((acc, data) => {
        return acc.concat(data);
      })
    );
  }

  selectPodcast = (podcastNumber) => {
    this.setState({ isPlaying: true, activePodcastNumber: podcastNumber, activePodcast: this.state.podcasts[podcastNumber] });
  }

  playNext = () => {
    if(this.state.podcasts[this.state.activePodcastNumber + 1]) { 
      this.setState({ activePodcastNumber: this.state.activePodcastNumber + 1, activePodcast: this.state.podcasts[this.state.activePodcastNumber + 1] });
    }
    else {
      this.setState({ activePodcast: null, activePodcastNumber: null })
    }
  }


 
  render() {
    return (
      <MuiThemeProvider theme={theme}>

        <CssBaseline />
      
        <HeaderComponent />

        <ListComponent onSelect={this.selectPodcast} podcasts={this.state.podcasts} activePodcastNumber={this.state.activePodcastNumber} />

        { this.state.activePodcast ? <PlayerComponent activePodcast={this.state.activePodcast} playNext={this.playNext} /> : '' }

      </MuiThemeProvider>
    );
  }
}

export default App