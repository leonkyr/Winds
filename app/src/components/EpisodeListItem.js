import getPlaceholderImageURL from '../util/getPlaceholderImageURL';
import Img from 'react-image';
import PropTypes from 'prop-types';
import React from 'react';
import pauseIcon from '../images/icons/pause.svg';
import playIcon from '../images/icons/play.svg';
import { withRouter } from 'react-router-dom';
import TimeAgo from './TimeAgo';
import { pinEpisode, unpinEpisode } from '../util/pins';
import { connect } from 'react-redux';

class EpisodeListItem extends React.Component {
	constructor(props) {
		super(props);
		this.state = { addToPlaylistPopoverIsOpen: false };
		this.toggleAddToPlaylistPopover = this.toggleAddToPlaylistPopover.bind(this);
	}

	toggleAddToPlaylistPopover() {
		this.setState({
			addToPlaylistPopoverIsOpen: !this.state.addToPlaylistPopoverIsOpen,
		});
	}

	render() {
		let icon;

		if (this.props.active) {
			icon = (
				<div className="pause-icon">
					<div className="icon-container">
						{this.props.playing ? (
							<Img decode={false} src={pauseIcon} />
						) : (
							<Img decode={false} src={playIcon} />
						)}
					</div>
				</div>
			);
		} else {
			icon = (
				<div className="play-icon">
					<div className="icon-container">
						<Img decode={false} src={playIcon} />
					</div>
				</div>
			);
		}

		return (
			<div className="list-item podcast-episode">
				<div
					className="left"
					onClick={() => {
						if (this.props.playable) {
							this.props.playOrPauseEpisode();
						} else {
							this.props.history.push(
								`/podcasts/${this.props.podcast._id}`,
							);
						}
					}}
				>
					<Img
						height="75"
						width="75"
						src={[
							this.props.images.og,
							this.props.podcast.images.featured,
							getPlaceholderImageURL(),
						]}
						loader={<div className="placeholder" />}
					/>
					{this.props.playable ? icon : null}
					{this.props.recent ? <div className="recent-indicator" /> : null}
				</div>
				<div
					className="right"
					onClick={() => {
						this.props.history.push(
							this.props.playable
								? `/podcasts/${this.props.podcast._id}/episodes/${
										this.props.episodeID
								  }`
								: `/podcasts/${this.props.podcast._id}`,
						);
					}}
				>
					<h2>{`${this.props.title}`}</h2>
					<div className="item-info">
						<span
							onClick={e => {
								e.preventDefault();
								e.stopPropagation();
								if (this.props.pinned) {
									unpinEpisode(
										this.props.pinID,
										this.props._id,
										this.props.dispatch,
									);
								} else {
									pinEpisode(this.props._id, this.props.dispatch);
								}
							}}
						>
							{this.props.pinned ? (
								<i className="fas fa-bookmark" />
							) : (
								<i className="far fa-bookmark" />
							)}
						</span>
						{this.props.link ? (
							<span>
								<i className="fa fa-external-link-alt" />
								<a
									href={this.props.link}
									onClick={e => e.stopPropagation()}
								>
									View on site
								</a>
							</span>
						) : null}
						<span>{this.props.podcast.title}</span>
						<span className="date">
							{'Posted '}
							<TimeAgo timestamp={this.props.publicationDate} />
						</span>
					</div>
					<div className="description">{this.props.description}</div>
				</div>
			</div>
		);
	}
}

EpisodeListItem.defaultProps = {
	liked: false,
	likes: 0,
	pinned: false,
	playable: false,
	playing: false,
	recent: false,
};

EpisodeListItem.propTypes = {
	active: PropTypes.bool,
	description: PropTypes.string,
	history: PropTypes.shape({
		push: PropTypes.func.isRequired,
	}).isRequired,
	images: PropTypes.shape({
		og: PropTypes.string,
	}),
	pinned: PropTypes.bool,
	playOrPauseEpisode: PropTypes.func,
	episodeID: PropTypes.string,
	playable: PropTypes.bool,
	playing: PropTypes.bool,
	link: PropTypes.string,
	podcast: PropTypes.shape({
		_id: PropTypes.string.isRequired,
		images: PropTypes.shape({
			featured: PropTypes.string,
		}),
		title: PropTypes.string,
	}).isRequired,
	publicationDate: PropTypes.string,
	recent: PropTypes.bool,
	title: PropTypes.string,
};

export default connect()(withRouter(EpisodeListItem));
