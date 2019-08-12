import React, { Component } from 'react';
import { EMPTY } from 'rxjs';
import { ajax } from 'rxjs/ajax';
import { expand, reduce } from 'rxjs/operators';
import CssBaseline from '@material-ui/core/CssBaseline';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import HeaderComponent from './Components/Header.js';
import ListComponent from './Components/List.js';
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
    podcasts: []
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

  render() {
    return (
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
      
        <HeaderComponent />

        <ListComponent podcasts={this.state.podcasts} />
        
      </MuiThemeProvider>
    );
  }
}

export default App