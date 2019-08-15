import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import ReactAudioPlayer from 'react-audio-player';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import PlayArrow from '@material-ui/icons/PlayArrow';
import Pause from '@material-ui/icons/Pause';
import LinearProgress from '@material-ui/core/LinearProgress';
import Box from '@material-ui/core/Box';
import PropTypes from 'prop-types';
import { IconButton } from '@material-ui/core';


const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        top: 'auto',
        bottom: 0,
        paddingRight: 15
    },
    progress: {
        height: 10,
        cursor: 'pointer',
    },
    progressBar: {
        minWidth: 20,
    },
    clickBox: {
        width: 300,
        position: 'fixed',
        height: 10,
        marginTop: -10,
        cursor: 'pointer'
    },
    playerStatus: {
        margin: 10,
    },
    playerText: {
        margin: 10,
    },
    progressDigits: {
        margin: 10,
    },
    grid: {
        maxWidth: 1000
    },
    overflow: {
        minWidth: 0,
        overflow: 'hidden'
    },
    scrollText: {
        maxWidth: 500,
    }
  });
  

class PlayerComponent extends Component {

    constructor(props) {
        super(props)

        this.titleRef = React.createRef();
        this.rap = React.createRef();
        this.progressBar = React.createRef();
        
        this.state = {
            scrollTextTranslate: 0,
            scrollTextWidth: '100%',
            scrollTextTransition: 'transform 9s, width 4s',
            currentTime: '00.00',
            duration: '00.00',
            durationPercentage: 0,
            isPlaying: false
        }
    }

    componentDidMount = () => {
        this.interval = setInterval(() => {
            const width = this.titleRef.current.offsetWidth;
            if(width < 200 || this.state.scrollTextTranslate === '-100%') {
                if(this.state.scrollTextTranslate === '0') {
                    this.setState({ scrollTextTransition: 'transform 9s, width 4s', scrollTextTranslate: '-100%', scrollTextWidth: '300%' });
                }
                else {
                    this.setState({ scrollTextTransition: 'transform 0s, width 0s', scrollTextTranslate: '0', scrollTextWidth: '100%' });
                }
            }
        }, 9500);

        this.player = this.rap.audioEl;
        this.setInitialState();
    }

    componentWillUnmount = () => {
        clearInterval(this.interval);
    }

    playerReady = () => {
        this.updatePlayer();
    }

    setInitialState() {
        const cachedBookmark = localStorage.getItem(`bookmark-${this.props.activePodcast.id}`);

        if(cachedBookmark) {
            const bookmark = JSON.parse(cachedBookmark);
            
            this.player.currentTime = bookmark.time;
        }
    } 

    updatePlayer = () => {

        var currentTimeString = this.getTimeString(this.player.currentTime);
        var durationTimeString = '-' + this.getTimeString(this.player.duration - this.player.currentTime);

        var durationPercentage = parseFloat((this.player.currentTime / this.player.duration) * 100);

        this.setState({ currentTime: currentTimeString, duration: durationTimeString, durationPercentage: durationPercentage })
        if(this.state.isPlaying && this.player.currentTime > 30) {
            const cachedBookmark = localStorage.getItem(`bookmark-${this.props.activePodcast.id}`);

            if(cachedBookmark) {
                const bookmark = JSON.parse(cachedBookmark);

                if(this.player.currentTime > bookmark.time) {
                    localStorage.setItem(`bookmark-${this.props.activePodcast.id}`, JSON.stringify({ time: this.player.currentTime }));
                }
                else if(this.player.currentTime < bookmark.time && bookmark.time > this.player.duration - 5) {
                    localStorage.setItem(`bookmark-${this.props.activePodcast.id}`, JSON.stringify({ time: this.player.currentTime }));
                }
            }
            else {
                localStorage.setItem(`bookmark-${this.props.activePodcast.id}`, JSON.stringify({ time: this.player.currentTime }));
            }
        }
    }

    getTimeString(time) {
        var minutes = Math.floor(time / 60);
        time -= minutes * 60;
        var seconds = parseInt(time % 60, 10);
        
        if(seconds < 10) {
            seconds = '0' + seconds;
        }

        if(minutes < 10) {
            minutes = '0' + minutes;
        }
        return `${minutes}:${seconds}`
    }

    onPlayClick = () => {
        if(this.state.isPlaying) {
            this.player.pause();
            this.setState({ isPlaying: false });
        }
        else {
            this.player.play();
            this.setState({ isPlaying: true });
        }
    }

    playTest = () => {
        this.setState({ isPlaying: true });

        const cachedBookmark = localStorage.getItem(`bookmark-${this.props.activePodcast.id}`);
        if(cachedBookmark) {
            const bookmark = JSON.parse(cachedBookmark);

            if(this.player.currentTime < bookmark.time - 5) {
                if(bookmark.time < this.player.duration - 5) {
                    this.player.currentTime = parseInt(bookmark.time);
                }
            }   
        }
    }

    onProgressClick = (event) => {
        const clickedX = event.nativeEvent.offsetX;
        
        var percent = (clickedX / this.progressBar.current.offsetWidth);

        this.player.currentTime = percent * this.player.duration;
    }

    render() {
        const scrollTextStyle = {
            transform: `translateX(${this.state.scrollTextTranslate})`,
            width: this.state.scrollTextWidth,
            transition: this.state.scrollTextTransition,
            transitionTimingFunction: 'linear',
            WebkitTransition: this.state.scrollTextTransition,
            WebkitTransitionTimingFunction: 'linear'
        }

        return (
            <div className={this.props.classes.root}>
                <AppBar position="fixed" color="default" className={this.props.classes.appBar}>
                    <ReactAudioPlayer ref={(element) => { this.rap = element; }} autoPlay={ this.props.autoPlay } onPlay={this.playTest} onCanPlay={this.playerReady} listenInterval={1000} onEnded={this.props.playNext} onListen={this.updatePlayer} src={this.props.activePodcast.url } />
                    <Box m={2} display="flex" flex-direction="row" justify="flex-start" alignItems="center" className={this.props.classes.box}>
                        <Box m={0} flexShrink={0}>
                            <IconButton onClick={ this.onPlayClick }>
                                { this.state.isPlaying ? <Pause /> : <PlayArrow /> }
                            </IconButton>
                        </Box>
                        <Box m={1} flex-direction="column" className={this.props.classes.overflow} flexShrink={2}>
                            <Typography ref={this.titleRef} noWrap variant="h6" style={ scrollTextStyle } className={this.props.classes.scrollText}>
                                {this.props.activePodcast.title }
                                <Typography noWrap variant="body2">
                                {this.props.activePodcast.description}
                                </Typography>
                            </Typography>
                        </Box>
                        <Box m={1} flexShrink={0}>
                            <Typography noWrap variant="body2">
                            { this.state.currentTime }
                            </Typography>
                        </Box>
                        <Box m={1} flexShrink={2} width={300}  >
                            <LinearProgress ref={this.progressBar} className={this.props.classes.progress} variant="determinate" value={this.state.durationPercentage} />
                            <div className={ this.props.classes.clickBox } onClick={(e) => { this.onProgressClick(e) }} />
                        </Box>
                        <Box m={1} flexShrink={0}>
                            <Typography noWrap variant="body2">
                            { this.state.duration }
                            </Typography>
                        </Box>
                    </Box>
                </AppBar>
            </div>
        );
    }
}

PlayerComponent.propTypes = {
    classes: PropTypes.object.isRequired,
  };
  
export default withStyles(styles)(PlayerComponent);