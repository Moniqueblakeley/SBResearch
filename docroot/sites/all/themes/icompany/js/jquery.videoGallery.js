
/*
 * Video Gallery With Live Playlist v3.12
 */

(function($) {

	$.fn.videoGallery = function(settings) {
	
	var _componentInited=false;
	
	var _body = $('body');
	var _window = $(window);
	var _doc = $(document);
	
	var baseURL = window.location.href;
	//console.log(baseURL);

	var _downEvent = "";
	var _moveEvent = "";
	var _upEvent = "";
	var hasTouch;
	var touchOn=true;
	if("ontouchstart" in window) {
		hasTouch = true;
		_downEvent = "touchstart.ap";
		_moveEvent = "touchmove.ap";
		_upEvent = "touchend.ap";
	}else{
		hasTouch = false;
		_downEvent = "mousedown.ap";
		_moveEvent = "mousemove.ap";
		_upEvent = "mouseup.ap";
	}

	var prevX=0;//mouse track pos
	
	//****************
	
	var mp4Support = canPlayMP4();
	var vorbisSupport = canPlayVorbis();
	var webmSupport = canPlayWebM();
	//console.log("vorbisSupport = " + vorbisSupport, ", mp4Support = " + mp4Support, ", webmSupport = " + webmSupport);
	var html5Support=(!!document.createElement('video').canPlayType);
	//html5Support=true;
	
	//icons
	
	//console.log(isSafari, isChrome);
	
	var thumbnailPreloaderUrl=hap_source_path+settings.buttonsUrl.thumbnailPreloaderUrl;
	
	//elements
	var mainWrapper = $(this);
	var componentWrapper = mainWrapper.find('.componentWrapper');
	var componentPlaylist = mainWrapper.find('.componentPlaylist');
	var innerWrapper = mainWrapper.find('.innerWrapper');
	var playlistType = settings.playlistType;
	var playlist_inner = playlistType == 'list' ? mainWrapper.find('.playlist_inner') : componentWrapper.find('.playlist_inner');
	var playlist_content = mainWrapper.find('.playlist_content');
	var playlistHolder=mainWrapper.find('.playlistHolder');
	var playlist_list= mainWrapper.find('.playlist_list');
	var playerHolder=mainWrapper.find('.playerHolder');
	var player_mediaTime_current=mainWrapper.find('.player_mediaTime_current');
	var player_mediaTime_total=mainWrapper.find('.player_mediaTime_total');
	var playerControls=mainWrapper.find('.playerControls');
	var player_toggleControl = mainWrapper.find('.player_toggleControl');
	var player_seekbar = mainWrapper.find('.player_seekbar');
	var progress_bg = mainWrapper.find('.progress_bg');
	var load_level = mainWrapper.find('.load_level');
	var progress_level = mainWrapper.find('.progress_level');
	var volume_seekbar = mainWrapper.find('.volume_seekbar').css('zIndex',300);
	var volume_bg = mainWrapper.find('.volume_bg');
	var volume_level = mainWrapper.find('.volume_level');
	var player_fullscreen= mainWrapper.find('.player_fullscreen');
	var player_captions= mainWrapper.find('.player_captions');
	var caption_holder= mainWrapper.find('.caption_holder').css('zIndex',301);
	if(!isMobile){
		caption_holder.bind('mouseenter', function(){
			if(!_componentInited || _playlistTransitionOn) return false;
			if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
			return false;
		}).bind('mouseleave', function(){
			if(!_componentInited || _playlistTransitionOn) return false;
			if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
			captionMenuTimeoutID = setTimeout(closeCaptionMenu, captionMenuTimeout);
			return false;
		});
	}
	var caption_btn= componentWrapper.find('.caption_btn');
	
	
	//main
	var flashMain = settings.flashMain;
	var youtubeIframeMain = mainWrapper.find('.youtubeIframeMain');
	
	//preview
	var flashPreview = settings.flashPreview;
	var flashPreviewHolder = mainWrapper.find('#flashPreviewHolder');
	
	var youtubeIframePreview=mainWrapper.find('.youtubeIframePreview').bind('click', function(e){
		togglePlayBack();
		return false;
	});
	/*left: = safari fix, preview has to be inside playlist only the first time, later we can move it -10000*/
	youtubeIframePreview.css({left:-youtubeIframePreview.width()+5+'px'}).bind('click', function(){
		return false;	
	});
	var yt_overlay_blocker;//block click on yt iframe (for html5 non-wall layout!)
	
	var playerHolder=mainWrapper.find('.playerHolder');
	var mediaHolder=mainWrapper.find('.mediaHolder').bind('click', function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		togglePlayBack();
		return false;
	});
	var mediaPreview=mainWrapper.find('.mediaPreview').bind('click', function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		togglePlayBack();
		return false;
	});
	var player_addon = mainWrapper.find('.player_addon');
	var playlist_toggle = mainWrapper.find('.playlist_toggle');
	var ap_share_btn = mainWrapper.find('.ap_share_btn');
	var ap_share_holder = mainWrapper.find('.ap_share_holder');
	var info_toggle = mainWrapper.find('.info_toggle');
	var infoHolder =mainWrapper.find('.infoHolder');
	var player_volume =mainWrapper.find('.player_volume');
	var big_play =mainWrapper.find('.big_play').css('cursor', 'pointer').bind('click', function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		togglePlayBack();
		return false;
	});
	var info_inner =mainWrapper.find('.info_inner');
	var preloader =mainWrapper.find('.preloader');
	var playlistControls =mainWrapper.find('.playlistControls');
	
	var scrollPaneRedo, previewOrigW, previewOrigH;
	
	//settings
	var mainPath='/main/';
	var previewPath=settings.previewPath;
	var wallPath=settings.wallPath;
	var useLivePreview=!isMobile ? settings.useLivePreview : false;
	if(!useLivePreview){
		mainWrapper.find('.youtubeIframePreview').remove();
		flashPreviewHolder.remove();
	}
	var autoPlay=settings.autoPlay;
	var yt_autoPlay= settings.autoPlay;
	var initialAutoplay= settings.autoPlay;
	if(isMobile){
		autoPlay =false;
		yt_autoPlay = false;
	}
	var autoAdvanceToNextVideo=settings.autoAdvanceToNextVideo;
	var autoHideControls=isMobile ? false : settings.autoHideControls;
	var captionsBottomPadding = settings.captionsBottomPadding;
	var autoOpenDescription=settings.autoOpenDescription;
	var playlistOrientation =settings.playlistOrientation;
	var scrollType = settings.scrollType;
	var autoOpenPlaylist=settings.autoOpenPlaylist;
	var randomPlay=settings.randomPlay;
	var loopingOn=settings.loopingOn;
	var autoMakePlaylistThumb = settings.autoMakePlaylistThumb;
	var autoMakePlaylistInfo = settings.autoMakePlaylistInfo;
	var useWebmVideoFormat = settings.useWebmVideoFormat;
	var aspectRatio=settings.aspectRatio;
	var layout100perc=settings.layout100perc;
	var playlistHidden=settings.playlistHidden;
	var useYoutubeHighestQuality = settings.useYoutubeHighestQuality;
	var closePlaylistOnFsEntry = settings.closePlaylistOnFsEntry;
	if(playlistHidden){
		playlistHolder.css('display','none');
		mainWrapper.find('.playlist_toggle').remove();	
	} 
	//wall
	if(playlistType=='wall'){//override defaults
		playlistHidden=false;
		autoMakePlaylistThumb=true;	
		activeItem=-1;
	}
	if(isMobile)aspectRatio=1;//no elements above video!
	if(isiPhoneIpod){
		//remove elements above video since we cant use them
		infoHolder.remove();
		playerControls.remove();
		player_addon.remove();
	}
	
	//vars
	var folderCounter, folderProcessArr = [];
	var _currentInsert, remove_node;//for youtube playlist append position
	var descriptionArr = [];//for youtube description
	var deeplinkData = [];
	var liProcessArr=[];
	var processPlaylistLength, processPlaylistCounter;
	var _activePlaylist;
	var _playlistTransitionOn=false;
	var lightbox_use=false, no_action_item=false;
	var html5video_inited=false;
	
	var mp4Path, ogvPath, imagePath;
	var previewVideo, previewVideoUp2Js;
	var lastPlaylist;
	var mediaPreviewType;
	var currentPreviewID=-1, pp_currentPreviewID=-1;
	
	var playlistOpened = playlistHolder.css('display')=='block' ? true : false, playlistFsState = playlistOpened;
	
	var yt_wall_pp_arr=[];//store pretyphoto a tags in which we need to wrap yt_overlay_blocker over yt iframe for wall layout
	var current_wall_yt_blocker;//for html5 wall layout, and flash layout
	var wallLayoutInited=false;
	
	var boxWidth, boxHeight, boxMarginBottom, boxMarginRight;
	
	var activePlaylistHit;
	var activePlaylistID;
	var activePlaylistThumb;
	var activePlaylistThumbImg;
	var activePlaylistPreloader;
	var activePlaylistVideoDiv;
	
	//fullscreen
	var fullscreenCount=0;
	var fullscreenPossible = false, fs_removed;
	if(checkFullScreenSupport()){
		fullscreenPossible = true;
	}else{
		//remove fs button in 100% layout becuase it doesnt do anything.
		if(isIE && layout100perc || isMobile && layout100perc){
			fs_removed=true;
			mainWrapper.find('.player_fullscreen').remove();
		}	
	}
	if(isIOS){
		 mainWrapper.find('.player_volume_wrapper').remove();
	}
			
	var toggleControl_width = mainWrapper.find('.player_toggleControl').outerWidth(true);
	var current_time_width = mainWrapper.find('.player_mediaTime_current').outerWidth(true);
	var total_time_width = mainWrapper.find('.player_mediaTime_total').outerWidth(true);
	var volume_width = mainWrapper.find('.player_volume_wrapper').outerWidth(true);
	var fullscreen_width = mainWrapper.find('.player_fullscreen').outerWidth(true);
	var player_captions_width = mainWrapper.find('.player_captions').outerWidth(true);	
			
	//youtube
	var _youtubePlayer, _youtubePreviewPlayer, _videoProcessCounter=0,_videoProcessData=[],playlistStartCounter, playlistEnlargeCounter=50, youtubePlaylistPath, 
	_youtubeInited=false, _youtubePreviewInited=false, _youtubeChromeless=true, currentObj;

	var previewPoster;
	
	var useCaptions = settings.useCaptions, captionsExist=false, captionTimeout=100, captionTimeoutID, active_caption_item, captionMenuTimeout=2000, captionMenuTimeoutID, captionMenuOpened=false, captions_menu;
	
	var videoInited=false;
	var mediaPath, flashMediaPath;	
	var previewMediaPath;	
	var ytMediaPath;
	var mediaPlaying=false;
	var thumbWidth, thumbHeight;
	
	var scrollCheckInterval = 100;
	var scrollCheckIntervalID;
	var flashReadyInterval = 100;
	var flashReadyIntervalID;
	var flashCheckDone=false;
	
	var controlsTimeout = settings.controlsTimeout;
	var controlsTimeoutID;
	
	var dataInterval = 10;//tracking media data
	var dataIntervalID;
	
	var thumbArr = [];
	var thumbImgArr = [];
	var thumbHitDivArr = [];
	var thumbPreloaderArr = [];
	var thumbVideoDivArr = [];
	var playlistArr=[];
	var playlistLength=0;
	
	var useRolloversOnButtons=true;
	var mediaWidth;
	var mediaHeight;
	var mediaType;
	var componentSize = 'normal';
	var video;
	var videoUp2Js;
	var infoOpened=false;
	
	var bodyOverflowOrig = _body.css('overflow');
	
	//scroll
	var info_scrollPaneApi;
	var scrollPane, scrollPaneApi;
	
	//buttons
	var thumbBackward, thumbForward;
	var _thumbScrollIntervalID;
	var _thumbsScrollValue=50;	
	var _thumbForwardSize;
	var _thumbBackwardSize;
	var _thumbInnerContainerSize, thumbInnerContainer;
	
	if(playlistType != 'wall'){
		if(scrollType == 'buttons'){
			thumbInnerContainer = playlist_inner;	
			if(hasTouch){
				initTouch();
			}
		}
	}
	
	var buttonArr=[
		player_toggleControl,
		mainWrapper.find('.playlist_toggle'),
		mainWrapper.find('.ap_share_btn'),
		mainWrapper.find('.info_toggle'),
		mainWrapper.find('.player_volume'),
		mainWrapper.find('.player_fullscreen'),
		mainWrapper.find('.caption_btn'),
		mainWrapper.find('.player_prev'),
		mainWrapper.find('.player_next')
	];
	var btn,len = buttonArr.length,i=0;
	for(i;i<len;i++){
		btn = $(buttonArr[i]).css('cursor', 'pointer').bind('click', clickControls);
		if(!isMobile && useRolloversOnButtons){
			btn.bind('mouseenter', overControls).bind('mouseleave', outControls);
		}
	}
	
	//*********** seekbar
	
	var seekBarDown=false,seekBarElementsSize,playerControlsSize,seekBarSize, player_seekbar_offset=30;
	
	player_seekbar.css('cursor', 'pointer').bind(_downEvent,function(e){
		_onDragStartSeek(e);
		return false;		
	}); 
	
	// Start dragging 
	function _onDragStartSeek(e) {
		if(!_componentInited || _playlistTransitionOn) return false;
		if(volumebarDown) return false;
		if(!seekBarDown){					
			var point;
			if(hasTouch){
				var currTouches = e.originalEvent.touches;
				if(currTouches && currTouches.length > 0) {
					point = currTouches[0];
				}else{	
					return false;						
				}
			}else{
				point = e;								
				e.preventDefault();						
			}
			seekBarDown = true;
			_doc.bind(_moveEvent, function(e) { _onDragMoveSeek(e); });
			_doc.bind(_upEvent, function(e) { _onDragReleaseSeek(e); });		
		}
		return false;	
	}
				
	function _onDragMoveSeek(e) {	
		var point;
		if(hasTouch){
			var touches;
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				touches = e.originalEvent.touches;
			}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				touches = e.originalEvent.changedTouches;
			}else{
				return false;
			}
			// If touches more then one, so stop sliding and allow browser do default action
			if(touches.length > 1) {
				return false;
			}
			point = touches[0];	
			e.preventDefault();				
		} else {
			point = e;
			e.preventDefault();		
		}
		setProgress(point.pageX);
		
		return false;		
	}
	
	function _onDragReleaseSeek(e) {
		if(seekBarDown){	
			seekBarDown = false;			
			_doc.unbind(_moveEvent).unbind(_upEvent);	
			
			var point;
			if(hasTouch){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e;
				e.preventDefault();		
			}
			setProgress(point.pageX);
		}
		return false;
	}	
	
	function setProgress(x) {
		var newPercent,ct,ct2f, seekPercent;
		
		seekPercent = x - progress_bg.offset().left;
		if(seekPercent<0) seekPercent=0;
		else if(seekPercent>seekBarSize) seekPercent=seekBarSize;
		newPercent = Math.max(0, Math.min(1, seekPercent / seekBarSize));
		//console.log('newPercent = ', newPercent);
		
		if(mediaType == 'local'){
			progress_level.css('width', seekPercent+'px');
			if(html5Support){
				if(videoInited){
					ct = newPercent * videoUp2Js.duration;
					ct2f = ct.toFixed(1);
					//console.log(videoUp2Js.seekable, videoUp2Js.seekable.length)
					try{
						videoUp2Js.currentTime = ct2f;
					}catch(er){}
				}
			}else{
				if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_seek(newPercent); 
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(html5Support){
				if(_youtubePlayer){
					ct = newPercent * _youtubePlayer.getDuration();
					ct2f = ct.toFixed(1);
					_youtubePlayer.seek(ct2f);
				}
			}else{
				if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_seek(newPercent);
			}
		}
	}
	
	if(!isMobile){
		var player_progress_tooltip = mainWrapper.find('.player_progress_tooltip').css({'left': parseInt(player_seekbar.css('left'), 10) + 'px', 'zIndex':302});
		player_seekbar.bind('mouseover', mouseOverHandlerSeek);
	}
	
	//************* seekbar tooltip
		
	function mouseOverHandlerSeek() {
		if(!videoInited) return false;
		player_progress_tooltip.css('display', 'block');
		player_seekbar.bind('mousemove', mouseMoveHandlerSeekTooltip).bind('mouseout', mouseOutHandlerSeek);
		_doc.bind('mouseout', mouseOutHandlerSeek);
	}
	
	function mouseOutHandlerSeek() {
		if(!videoInited) return false;
		player_progress_tooltip.css('display', 'none');
		player_seekbar.unbind('mousemove', mouseMoveHandlerSeekTooltip).unbind('mouseout', mouseOutHandlerSeek);
		_doc.unbind('mouseout', mouseOutHandlerSeek);
	}
	
	function mouseMoveHandlerSeekTooltip(e){
		var s = e.pageX - progress_bg.offset().left;
		if(s<0) s=0;
		else if(s>seekBarSize) s=seekBarSize;
		
		var center = parseInt(e.pageX - player_seekbar.offset().left - player_progress_tooltip.width() / 2,10);
		player_progress_tooltip.css('left', center + 'px');
		
		var newPercent = Math.max(0, Math.min(1, s / seekBarSize));
		var value, dur;
		
		if(mediaType == 'local'){
			if(html5Support){
				value=newPercent * videoUp2Js.duration, dur = videoUp2Js.duration;
			}else{
				if(typeof getFlashMovie(flashMain) !== "undefined"){
					dur = getFlashMovie(flashMain).pb_getFlashDuration();
					value=newPercent * dur;
				}else{
					return;	
				}
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(html5Support){
				value=newPercent *_youtubePlayer.getDuration();
				dur = _youtubePlayer.getDuration();
			}else{
				if(typeof getFlashMovie(flashMain) !== "undefined"){
					dur = getFlashMovie(flashMain).pb_getFlashDuration();
					value=newPercent * dur;
				}else{
					return;	
				}
			}
		}
		player_progress_tooltip.find('p').html(formatCurrentTime(value)+' | '+formatDuration(dur));
	}
	
	//********* volume
	
	var volume_seekbar_autoHide = true;
	var defaultVolume =settings.defaultVolume;
	var _lastVolume;
	if(defaultVolume<0) defaultVolume=0;
	if(defaultVolume == 0) _lastVolume=0.5;//if we click unmute from mute on the beginning
	else if(defaultVolume>1)defaultVolume=1;
	if(defaultVolume!=0)_lastVolume = defaultVolume;
	var volumebarDown=false;
	var volumeSize=volume_bg.height();
	volume_level.css('height', defaultVolume*volumeSize+'px');
	
	var vol_seekbar_opened=false;//for mobile (we cant use rollover to open vol seekbar and click on vol toggle btn to toggle mute/unmute, so we use vol toggle btn just to open/close vol seekbar on mobile)
	var volumeTimeoutID, volumeTimeout = 3000;//hide volume seekbar
	
	function hideVolume(){
		if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		volume_seekbar.css('display','none');
		vol_seekbar_opened=false;
	}
	
	function toggleVolumeMobile(){
		if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		if(!vol_seekbar_opened){
			volume_seekbar.css('display','block');
			vol_seekbar_opened=true;
			//additional hide volume on timer 
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);	
		}else{
			volume_seekbar.css('display','none');
			vol_seekbar_opened=false;
		}
	}
	
	if(!isMobile){
		player_volume.bind('mouseover', function(){
			if(!_componentInited) return false;
			//show volume seekbar
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volume_seekbar.css('display','block');
			vol_seekbar_opened=true;
			if(useCaptions && captionsExist)closeCaptionMenu();//close caption menu so it doesnt sit above volume
			return false;
		}).bind('mouseout', function(){
			if(!_componentInited) return false;
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);
			return false;
		});
	}else{
		player_volume.bind('click', function(){//close caption menu so it doesnt sit above volume
			if(!_componentInited) return false;
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			if(useCaptions && captionsExist)closeCaptionMenu();
			return false;
		});
	}
	
	if(defaultVolume == 0){
		mainWrapper.find('.player_volume').find('i').removeClass('fa-volume-up ap_vol_on ap_vol').addClass('fa-volume-off ap_mute');
	}
	
	volume_seekbar.css('cursor', 'pointer').bind(_downEvent,function(e){
		_onDragStartVol(e);
		return false;		
	}); 
	
	// Start dragging 
	function _onDragStartVol(e) {
		if(!_componentInited || _playlistTransitionOn) return false;
		if(seekBarDown) return false;
		if(!volumebarDown){					
			var point;
			if(hasTouch){
				var currTouches = e.originalEvent.touches;
				if(currTouches && currTouches.length > 0) {
					point = currTouches[0];
				}else{	
					return false;						
				}
			}else{
				point = e;								
				e.preventDefault();						
			}
			volumebarDown = true;
			_doc.bind(_moveEvent, function(e) { _onDragMoveVol(e); }).bind(_upEvent, function(e) { _onDragReleaseVol(e); });		
		}
		return false;	
	}
				
	function _onDragMoveVol(e) {	
		var point;
		if(hasTouch){
			var touches;
			if(e.originalEvent.touches && e.originalEvent.touches.length) {
				touches = e.originalEvent.touches;
			}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				touches = e.originalEvent.changedTouches;
			}else{
				return false;
			}
			// If touches more then one, so stop sliding and allow browser do default action
			if(touches.length > 1) {
				return false;
			}
			point = touches[0];	
			e.preventDefault();				
		} else {
			point = e;
			e.preventDefault();		
		}
		volumeTo(point.pageY);
		
		return false;		
	}
	
	function _onDragReleaseVol(e) {
		if(volumebarDown){	
			volumebarDown = false;			
			_doc.unbind(_moveEvent).unbind(_upEvent);	
			
			var point;
			if(hasTouch){
				var touches;
				if(e.originalEvent.touches && e.originalEvent.touches.length) {
					touches = e.originalEvent.touches;
				}else if(e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
					touches = e.originalEvent.changedTouches;
				}else{
					return false;
				}
				// If touches more then one, so stop sliding and allow browser do default action
				if(touches.length > 1) {
					return false;
				}
				point = touches[0];	
				e.preventDefault();				
			} else {
				point = e;
				e.preventDefault();		
			}
			
			volumeTo(point.pageY);
			
		}
		return false;
	}	
	
	function volumeTo(y) {
		defaultVolume = Math.max(0, Math.min(1, (y - volume_bg.offset().top) / volumeSize));
		defaultVolume = 1 - defaultVolume;//reverse
		setVolume();
	}
	
	function toggleVolume(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(defaultVolume>0){
			_lastVolume = defaultVolume;//remember last volume
			defaultVolume = 0;//set mute on (volume to 0)
		}else{
			defaultVolume = _lastVolume;//restore last volume
		}
	}
	
	function setVolume(){
		//console.log('setVolume ', defaultVolume);
		volume_level.css('height', defaultVolume*volumeSize+'px');
		//if(!videoInited)return false;
		if(html5Support){
			if(mediaType == 'local'){
				if(videoUp2Js)videoUp2Js.volume = defaultVolume;
			}else{
				if(_youtubePlayer) _youtubePlayer.setVolume(defaultVolume);
			}
		}else{
			if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_setVolume(defaultVolume); 
		}
		
		if(defaultVolume == 0){
			mainWrapper.find('.player_volume').find('i').removeClass('fa-volume-up ap_vol_on ap_vol').addClass('fa-volume-off ap_mute');
			//if(mediaType == 'local' && html5Support)videoUp2Js.muted = true;
		}else if(defaultVolume > 0){
			mainWrapper.find('.player_volume').find('i').removeClass('fa-volume-off ap_mute_on ap_mute').addClass('fa-volume-up ap_vol');
			//if(mediaType == 'local' && html5Support)videoUp2Js.muted = false;
		}
		
		if(isMobile && volume_seekbar_autoHide){//additional hide volume on timer after we use vol seekbar so vol toggle btn doesnt have to be used to close vol seekbar. This also reset volumeTimeoutID which is necessary, otherwise volume seekbar would close even while we touch on it constantly in less time than volumeTimeout
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);	
		}
	}
	
	
	if(!isMobile){
		volume_seekbar.bind('mouseover', mouseOverHandlerVolume);
		var player_volume_tooltip = componentWrapper.find('.player_volume_tooltip'), player_volume_tooltip_origT = parseInt(player_volume_tooltip.css('top'),10);
		
		//prevent mouse stuck over tooltip
		player_volume_tooltip.bind('mouseenter', function(){
			volume_seekbar.unbind('mouseover', mouseOverHandlerVolume);
			player_volume_tooltip.css('display', 'none');
		}).bind('mouseleave', function(){
			volume_seekbar.bind('mouseover', mouseOverHandlerVolume); 
		});	
	}
	
	//************* volume tooltip
	
	function mouseOverHandlerVolume() {
		if(volume_seekbar_autoHide) if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
		player_volume_tooltip.css('display', 'block');
		volume_seekbar.bind('mousemove', mouseMoveHandlerVolumeTooltip).bind('mouseout', mouseOutHandlerVolume);
		_doc.bind('mouseout', mouseOutHandlerVolume);
	}
	
	function mouseOutHandlerVolume() {
		if(volume_seekbar_autoHide){
			if(volumeTimeoutID) clearTimeout(volumeTimeoutID);
			volumeTimeoutID = setTimeout(hideVolume,volumeTimeout);
		}
		player_volume_tooltip.css('display', 'none');
		volume_seekbar.unbind('mousemove', mouseMoveHandlerVolumeTooltip).unbind('mouseout', mouseOutHandlerVolume);
		_doc.unbind('mouseout', mouseOutHandlerVolume);
	}
	
	function mouseMoveHandlerVolumeTooltip(e){
		var s = e.pageY - volume_bg.offset().top;
		if(s<0) s=0;
		else if(s>volumeSize) s=volumeSize;
		
		var center = parseInt(s - player_volume_tooltip.height()/2+player_volume_tooltip_origT,10);
		player_volume_tooltip.css('top', center + 'px');
		
		var newPercent = Math.max(0, Math.min(1, s / volumeSize));
		newPercent = 1 - newPercent;//reverse
		var value=parseInt(newPercent * 100, 10);
		player_volume_tooltip.find('p').html(value+' %');
	}
	
	//****************
	
	if(!html5Support){
		mp4Support=true;
	}
	
	//*************** end volume

	function initTouch(){
		var startX,
			startY,
			touchStartX,
			touchStartY,
			moved,
			moving = false;

		thumbInnerContainer.unbind('touchstart.ap touchmove.ap touchend.ap click.ap-touchclick').bind(
			'touchstart.ap',
			function(e){
				if(!_componentInited || _playlistTransitionOn) return false;
				if(!touchOn){//if touch disabled we want click executed
					return true;
				}
				var touch = e.originalEvent.touches[0];
				startX = thumbInnerContainer.position().left;
				startY = thumbInnerContainer.position().top;
				touchStartX = touch.pageX;
				touchStartY = touch.pageY;
				moved = false;
				moving = true;
			}
		).bind(
			'touchmove.ap',
			function(ev){
				if(!moving){
					return;
				}
				var touchPos = ev.originalEvent.touches[0];
				if(playlistOrientation =='horizontal'){
					var value = startX - touchStartX + touchPos.pageX, w = componentPlaylist.width();
					
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevBtn('off');
					}else{
						togglePrevBtn('on');
					}
					if(value < w- _thumbInnerContainerSize){
						value=w- _thumbInnerContainerSize;	
						toggleNextBtn('off');
					}else{
						toggleNextBtn('on');
					}
								
					thumbInnerContainer.css('left',value+'px');
				}else{
					var value=startY - touchStartY + touchPos.pageY, h = componentPlaylist.height();
					
					//toggle advance buttons
					if(value > 0){
						value=0;	
						togglePrevBtn('off');
					}else{
						togglePrevBtn('on');
					}
					if(value < h- _thumbInnerContainerSize){
						value=h- _thumbInnerContainerSize;	
						toggleNextBtn('off');
					}else{
						toggleNextBtn('on');
					}
					
					thumbInnerContainer.css('top',value+'px');
				}
				moved = moved || Math.abs(touchStartX - touchPos.pageX) > 5 || Math.abs(touchStartY - touchPos.pageY) > 5;
				
				return false;
			}
		).bind(
			'touchend.ap',
			function(e){
				moving = false;
			}
		).bind(
			'click.ap-touchclick',
			function(e){
				if(moved) {
					moved = false;
					return false;
				}
			}
		);
	}
		
	//*************** scroll button functions
		
	function _scrollThumbsBack() {
		var value;
		if(playlistOrientation == 'horizontal'){
			value = parseInt(thumbInnerContainer.css('left'),10);
			value+=_thumbsScrollValue;
			if(value > 0){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				value=0;	
				togglePrevBtn('off');
			}else{
				togglePrevBtn('on');
			}
			thumbInnerContainer.css('left', value+'px');
		}else{
			value = parseInt(thumbInnerContainer.css('top'),10);
			value+=_thumbsScrollValue;
			if(value > 0){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				value=0;	
				togglePrevBtn('off');
			}else{
				togglePrevBtn('on');
			}
			thumbInnerContainer.css('top', value+'px');
		}
		toggleNextBtn('on');
	}
	
	function _scrollThumbsForward() {
		var value;
		if(playlistOrientation == 'horizontal'){
			value = parseInt(thumbInnerContainer.css('left'),10), w = componentPlaylist.width();
			value-=_thumbsScrollValue;
			if(value < w- _thumbInnerContainerSize){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				value=w- _thumbInnerContainerSize;	
				toggleNextBtn('off');
			}else{
				toggleNextBtn('on');
			}
			thumbInnerContainer.css('left', value+'px');
		}else{
			value = parseInt(thumbInnerContainer.css('top'),10), h = componentPlaylist.height();
			value-=_thumbsScrollValue;
			if(value < h- _thumbInnerContainerSize){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				value=h- _thumbInnerContainerSize;	
				toggleNextBtn('off');
			}else{
				toggleNextBtn('on');
			}
			thumbInnerContainer.css('top', value+'px');
		}
		togglePrevBtn('on');
	}
	
	function togglePrevBtn(dir) {
		if(dir == 'on'){
			thumbBackward.css('display','block');
		}else{
			thumbBackward.css('display','none');
		}
	}
	
	function toggleNextBtn(dir) {
		if(dir == 'on'){
			thumbForward.css('display','block');
		}else{
			thumbForward.css('display','none');
		}
	}
	
	function _checkThumbPosition() {
		//console.log('_checkThumbPosition');
		
		if(playlistOrientation == 'horizontal'){
			var w = componentPlaylist.width(), value;
			if(_thumbInnerContainerSize > w){
				togglePrevBtn('on');
				toggleNextBtn('on');
				touchOn=true;
				value = parseInt(thumbInnerContainer.css('left'),10);
				if(value < w- _thumbInnerContainerSize){
					if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
					value=w- _thumbInnerContainerSize;	
				}else if(value > 0){
					value=0;
				}
				thumbInnerContainer.css('left', value+'px');
				togglePrevBtn('off');//on beginning
			}else{
				togglePrevBtn('off');
				toggleNextBtn('off');
				touchOn=false;
				//thumbInnerContainer.css('left', w / 2 - _thumbInnerContainerSize / 2 +'px');//center thumbs if less
			}
		}else{
			var h = componentPlaylist.height(), value;
			if(_thumbInnerContainerSize > h){
				togglePrevBtn('on');
				toggleNextBtn('on');
				touchOn=true;
				value = parseInt(thumbInnerContainer.css('top'),10);
				if(value < h- _thumbInnerContainerSize){
					if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
					value=h- _thumbInnerContainerSize;	
				}else if(value > 0){
					value=0;
				}
				thumbInnerContainer.css('top', value+'px');
				togglePrevBtn('off');//on beginning
			}else{
				togglePrevBtn('off');
				toggleNextBtn('off');
				touchOn=false;
				//thumbInnerContainer.css('top', h / 2 - _thumbInnerContainerSize / 2 +'px');//center thumbs if less
			}
		}
	}
		
	//**********
	
	function checkScroll(){
		//console.log('checkScroll');
		
		if(scrollType == 'scroll'){
		
			if(playlistType == 'list'){
				if(!scrollPane){
					scrollPane = playlist_inner;
					scrollPane.jScrollPane({
						verticalDragMinHeight: 100,
						verticalDragMaxHeight: 100,
						horizontalDragMinWidth: 100,
						horizontalDragMaxWidth: 100
					});
					scrollPaneApi = scrollPane.data('jsp');
					
					scrollPane.bind('jsp-initialised',function(event, isScrollable){
						//console.log('Handle jsp-initialised', this,'isScrollable=', isScrollable);
					})
					if(playlistOrientation == 'horizontal'){
						if(!isMobile)playlist_inner.bind('mousewheel', horizontalMouseWheel);
					}
					
				}else{
					if(playlistHolder.css('display')=='block'){
						scrollPaneApi.reinitialise();
						if(playlistOrientation == 'vertical'){
							scrollPaneApi.scrollToY(0);
							$('.jspPane').css('top',0+'px');
						}else{
							scrollPaneApi.scrollToX(0);
							$('.jspPane').css('left',0+'px');
						}
					}else{
						scrollPaneRedo = true;
					}
				}
			}
		
		}else if(scrollType == 'buttons'){
			
			thumbBackward = mainWrapper.find('.thumbBackward').css({cursor:'pointer', display:'none'})
			.bind(_downEvent, function(){
				if(!_componentInited || _playlistTransitionOn) return false;
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				_thumbScrollIntervalID = setInterval(function() { _scrollThumbsBack(); }, 100);
				return false;
			}).bind(_upEvent, function(){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				return false;
			});
			
			thumbForward = mainWrapper.find('.thumbForward').css({cursor:'pointer', display:'none'})
			.bind(_downEvent, function(){
				if(!_componentInited || _playlistTransitionOn) return false;
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				_thumbScrollIntervalID = setInterval(function() { _scrollThumbsForward(); }, 100);
				return false;
			}).bind(_upEvent, function(){
				if(_thumbScrollIntervalID) clearInterval(_thumbScrollIntervalID);
				return false;
			});
			
			_checkThumbPosition();
			
			if(!isMobile){
				playlist_inner.bind('mousewheel', function(event, delta, deltaX, deltaY){
					//console.log(event);
					if(!_componentInited || _playlistTransitionOn) return false;
					var d = delta > 0 ? 1 : -1, value, componentPlaylistSize;//normalize
					
					if(playlistOrientation == 'vertical'){
						componentPlaylistSize = componentPlaylist.height();
					}else{
						componentPlaylistSize = componentPlaylist.width();
					}
					
					var s = componentPlaylistSize;
					if(playlistOrientation =='horizontal'){
						if(_thumbInnerContainerSize < s) return false;//if centered
						value = parseInt(thumbInnerContainer.css('left'),10);
						value+=_thumbsScrollValue*d;
						if(value > 0){
							value=0;	
						}else if(value < s- _thumbInnerContainerSize){
							value=s- _thumbInnerContainerSize;	
						}
						thumbInnerContainer.css('left', value+'px');
					}else{
						if(_thumbInnerContainerSize < s) return false;
						value = parseInt(thumbInnerContainer.css('top'),10);
						value+=_thumbsScrollValue*d;
						if(value > 0){
							value=0;	
						}else if(value < s- _thumbInnerContainerSize){
							value=s- _thumbInnerContainerSize;	
						}
						thumbInnerContainer.css('top', value+'px');
					}
					//adjust buttons
					if(value == 0){
						togglePrevBtn('off');
						toggleNextBtn('on');
					}else if(value <= s- _thumbInnerContainerSize){
						toggleNextBtn('off');
						togglePrevBtn('on');
					}else{
						togglePrevBtn('on');
						toggleNextBtn('on');
						touchOn=true;
					}
					return false;
				});	
			}
		}
	}
	
	function horizontalMouseWheel(event, delta, deltaX, deltaY){//for thumb scroll
		if(!_componentInited || _playlistTransitionOn) return false;
		var d = delta > 0 ? -1 : 1;//normalize
		if(scrollPaneApi) scrollPaneApi.scrollByX(d * 100);
		return false;
	}
	
	//***************** playlist manager
	
	var pm_settings = {'randomPlay': randomPlay, 'loopingOn': loopingOn};
	var _playlistManager = $.playlistManager(pm_settings);
	$(_playlistManager).bind('ap_PlaylistManager.COUNTER_READY', function(){
		//console.log('COUNTER_READY');
		
		if(useDeeplink){
			if(!_addressSet){
				//console.log('...1');
				$.address.value(findAddress2(_playlistManager.getCounter()));
				if(!$.address.history()) $.address.history(true);//restore history
			}else{
				//console.log('...2');
				_addressSet=false;
				_disableActiveItem();
				_findMedia();
			}
		}else{
			_disableActiveItem();
			_findMedia();
		}
	});
	$(_playlistManager).bind('ap_PlaylistManager.PLAYLIST_END', function(){
		//console.log('PLAYLIST_END');
		_disableActiveItem();
		videoGalleryPlaylistEnd();
	});
	
	//*************** deeplinking
	/*
	IMPORTANT!
	Since we cant see all the deplinks before each playlist has been processed (this would be valid only for single video links), first search for first level url on each playlist, then process this playlist and create deeplinking for this category (playlist).
	1. on each deeplink change check first level, find if already loaded, if not load, if yes, find second level from there. If not found - 404
	*/
	
	var categoryArr=[],cat;
	playlist_list.children("div[data-address]").each(function(){
			var obj = {};
			cat = $(this);
			obj.categoryName = cat.attr('data-address');
			obj.id = cat.attr('id');
			categoryArr.push(obj);
	});
	//console.log(categoryArr);
	var getDeeplinkData=false;
	//console.log(categoryArr);
	var categoryLength = categoryArr.length;
	//console.log('categoryLength = ', categoryLength);
	
	var useDeeplink=playlistType == 'wall' ? false : settings.useDeeplink;
	if(useDeeplink){
		
		var strict = $.address.strict() ? '#/' : '#';
		var dlink;
		var secondLevelExist=false;
		var secondLevel;
		var firstLevel;
		var deepLink;
		var _addressSet=false;
		var _addressInited=false;
		var addressTimeout=500;
		var addressTimeoutID;
		var _externalChangeEvent;
		var startUrl=settings.activePlaylist;
		if(!isEmpty(startUrl)){
			if(!isEmpty(settings.activeItem)){
				startUrl += '/'+settings.activeItem;//append second level
			}
		}
		//console.log(startUrl);
		var activeCategory;
		var currentCategory;
		var activeItem;
		var transitionFinishInterval=100;
		var transitionFinishIntervalID;
		var reCheckAddressTimeoutID;
		var reCheckAddressTimeout = 250;//address sometimes doesnt fire on beginning
	
		//console.log($.address.strict());
		//$.address.strict(false);
		//$.address.init(initAddress);
		$.address.internalChange(function(e){
			e.stopPropagation();
			//console.log("internalChange: ", e.value);
			if(reCheckAddressTimeoutID) clearTimeout(reCheckAddressTimeoutID);
			onChange(e);
		});
		$.address.externalChange(function(e){
			e.stopPropagation();
			//console.log("externalChange: ", e.value);
			if(reCheckAddressTimeoutID) clearTimeout(reCheckAddressTimeoutID);
			_externalChangeEvent = e;
			if(!_playlistTransitionOn){
				if(!_addressInited){
					//on the beginning onExternalChange fires first, then onInternalChange immediatelly, so skip onExternalChange call
	
					if(e.value == "/"){
						//console.log('strict mode off, skip /');
						
						_addressSet=true;
						$.address.history(false);//skip the "/"
						
						if(!isEmpty(startUrl)){
							$.address.value(startUrl);
							if(!$.address.history()) $.address.history(true);//restore history
						}else{
							//open menu
							//toggleMenuHandler(true);
						}
						
					}else if(isEmpty(e.value)){
						//console.log('strict mode on');
						_addressSet=true;
						$.address.history(false);//skip the ""
						
						if(!isEmpty(startUrl)){
							$.address.value(startUrl);
							if(!$.address.history()) $.address.history(true);//restore history
						}else{
							//open menu
							//toggleMenuHandler(true);
						}
					}else{
						//console.log('other deeplink start');
						onChange(e);
					}
					
					return;
				}
				if(addressTimeoutID) clearTimeout(addressTimeoutID);
				addressTimeoutID = setTimeout(swfAddressTimeoutHandler, addressTimeout);
			}else{
				if(addressTimeoutID) clearTimeout(addressTimeoutID);
				//wait for transition finish
				if(transitionFinishIntervalID) clearInterval(transitionFinishIntervalID);
				transitionFinishIntervalID = setInterval(transitionFinishHandler, transitionFinishInterval);
			}
		});
	}else{//no deeplink
		_activePlaylist=settings.activePlaylist;
		_setPlaylist();	
	}
	
	function transitionFinishHandler() {
		//console.log('transitionFinishHandler');
		if(!_playlistTransitionOn){//when module transition finishes
			if(transitionFinishIntervalID) clearInterval(transitionFinishIntervalID);
			if(addressTimeoutID) clearTimeout(addressTimeoutID);
			onChange(_externalChangeEvent);
		}
	}
	
	function reCheckAddress() {
		//console.log('reCheckAddress');
		if(reCheckAddressTimeoutID) clearTimeout(reCheckAddressTimeoutID);
		_addressSet=true;
		$.address.history(false);//skip the "/"
		
		if(!isEmpty(startUrl)){
			$.address.value(startUrl);
			if(!$.address.history()) $.address.history(true);//restore history
		}else{
			//open menu
			//toggleMenuHandler(true);
		}
	}
	
	function swfAddressTimeoutHandler() {
		//timeout if user repeatedly pressing back/forward browser buttons to stop default action executing immediatelly
		if(addressTimeoutID) clearTimeout(addressTimeoutID);
		onChange(_externalChangeEvent);
	}
	
	//fix for window.load instead of document.ready
	/*if(var reCheckAddressTimeoutID) clearTimeout(var reCheckAddressTimeoutID);
	var reCheckAddressTimeoutID = setTimeout(function(){
		if(reCheckAddressTimeoutID) clearTimeout(reCheckAddressTimeoutID);
		reCheckAddress();
	},var reCheckAddressTimeout);*/
	
	//************************** deeplinking	
			
	/*
	http://www.asual.com/jquery/address/docs/
				
	internalChange is called when we set value ourselves; 
	externalChange is called when the URL is changed or the browser backward or forward button is pressed. 
	
	I don't want to an AJAX request if there are no query parameters in the URL, which is why I test for an empty object.
	if($.isEmptyObject(event.parameters))
	return;
	  
	jQuery.address.strict(false);//Note that you need to disable plugin's strict option, otherwise it would add slash symbol immediately after hash symbol, like this: #/11.
	*/
	
	function filterAllowedChars(str) {
		var allowedChars = "_-";
		var n = str.length;
		var returnStr = "";
		var i = 0;
		var _char;
		var z;
		for (i; i < n; i++) {
			_char = str.charAt(i).toLowerCase(); //convert to lowercase
			if (_char == "\\") _char = "/";
			z = getCharCode(_char);			
			if ((z >= getCharCode("a") && z <= getCharCode("z")) || (z >= getCharCode("0") && z <= getCharCode("9")) || allowedChars.indexOf(_char) >= 0) {
				//only accepted characters (this will remove the spaces as well)
				returnStr += _char;
			}
		}
		return returnStr;
	}
	
	function getCharCode(s) {
		return s.charCodeAt(0);
	}
	
	function initAddress(e) {
		e.stopPropagation();
		//console.log("init: ", e.value);
	}
	
	function onChange(e) {
		e.stopPropagation();
		//console.log("onChange: ", e.value);
		
		if(!_addressInited){
			_addressInited = true;
		}
		
		deepLink = e.value;
		if(deepLink.charAt(0) == "/") deepLink = deepLink.substring(1)//check if first character is slash
		if(deepLink.charAt(deepLink.length - 1) == "/") deepLink = deepLink.substring(0, deepLink.length - 1)//check if last character is slash
		//console.log("onChange after trim: ", deepLink);

		//check if first level exist
		var first_level = findFirstLevel(deepLink);
		if(!findCategoryByName(first_level)){
			alert('404 page not found, check your deeplinks first level!');
			$.address.history(false);//skip invalid url
			return false;
		}
		
		_addressSet=false;

		//check for category change
		if(currentCategory == undefined || currentCategory != activeCategory){
			//process new playlist and get deeplink data
			_setPlaylist();	
			return;
		}
		
		//console.log('console.log(_playlistManager.getCounter(), activeItem); = ', _playlistManager.getCounter(), ' , ', activeItem);
		if(secondLevel){
			if(!findCounterByName(secondLevel)){//if second level exist but invalid
				alert('404 page not found, check your deeplinks second level!');
				$.address.history(false);//skip invalid url
				return;	
			}
		}else{//back from 2 level to one level
			destroyMedia();
			//console.log('here destroyMedia');
			return;
		}
		
		if(_playlistManager.getCounter() != activeItem){
			//console.log('1a.......');
			_addressSet=true;
			if(_playlistManager.getCounter()!=-1)_enableActiveItem();
			_playlistManager.setCounter(activeItem, false);
		}else{
			//console.log('2a.......');
			_disableActiveItem();
			_findMedia();
		}
	}
	
	function findAddress(value){
		//console.log('findAddress');
		
		var arr = value.split('/'), single_level = false;
		if(arr.length!=2){
			single_level = true;
			nameFound=true;
		}
		//console.log(arr);
		var category_name=arr[0],categoryFound=false,nameFound=false,i = 0, len = categoryArr.length;
		
		for(i; i < len;i++){
			if(categoryArr[i].categoryName == category_name){
				//console.log('activeCategory = ', i, ' , category_name = ', category_name);
				activeCategory = i;
				categoryFound=true;
				break;	
			}
		}
		if(!categoryFound) return false;
	
		if(single_level){
			media_name=arr[1];
			
			i = 0, arr = categoryArr[activeCategory].mediaName;
			var len = arr.length;
			for(i; i < len;i++){
				if(arr[i] == media_name){
					//console.log('activeItem = ', i, ' , media_name = ', media_name);
					activeItem = i;
					nameFound=true;
					break;	
				}
			}
		}
		
		if(!categoryFound || !nameFound){
			return false;
		}else{
			return true;	
		}
	}
	
	function findCounterByName(value){
		var found=false, i = 0, arr = categoryArr[activeCategory].mediaName, len = arr.length;
		for(i; i < len;i++){
			if(arr[i] == value){
				//console.log('findCounterByName: ', i, ' ', value);
				activeItem = i;
				found=true;
				break;	
			}
		}
		if(!found){
			return false;
		}else{
			return true;	
		}
	}
	
	function findCategoryByName(value){
		var found=false, i = 0;
		for(i; i < categoryLength;i++){
			if(categoryArr[i].categoryName == value){
				//console.log('findCategoryByName: ', i, value);
				activeCategory = i;
				_activePlaylist = categoryArr[i].id;//get id attributte from current deepling
				found=true;
				break;	
			}
		}
		if(!found){
			return false;
		}else{
			return true;	
		}
	}
	
	function findAddress2(i){//return media name with requested counter
		//console.log('findAddress2');
		var arr = categoryArr[activeCategory].mediaName;
		return categoryArr[activeCategory].categoryName+'/'+arr[i];
	}
	 
	function findFirstLevel(value){
		var str_to_filter, result;
		if(value.indexOf('/') > 0){//two level
			secondLevelExist=true;
			str_to_filter = value.substr(0, value.indexOf('/'));
			firstLevel=str_to_filter;
			secondLevel = value.substr(value.indexOf('/')+1);//remember second part url
		}else{
			firstLevel=value;
			secondLevelExist=false;
			secondLevel=null;
			str_to_filter = value;//single level
		}
		//console.log('firstLevel = ', firstLevel);
		//console.log('secondLevel = ', secondLevel);
		result = filterAllowedChars(str_to_filter);
		return result;
	}
	
	
	//******************* PLAYLIST PROCESS
	
	function _setPlaylist() {
		//console.log('_setPlaylist');
		_playlistTransitionOn=true;
		if(preloader.length)preloader.css('display','block');
		
		//reset
		if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
	
		if(lastPlaylist){//clean last playlist
			cleanMedia();
			mediaHolder.html('').css('display', 'none');
			if(useLivePreview)cleanPreviewVideo();
			playlist_content.empty();
		}

		if(playlistType=='wall'){
			var i = 0, len = yt_wall_pp_arr.length;
			for(i;i<len;i++){
				if(yt_wall_pp_arr[i])yt_wall_pp_arr[i].remove();//remove prettyphoto holders for wall layout
			}
			yt_wall_pp_arr=[];
			if(current_wall_yt_blocker) current_wall_yt_blocker=null;
			wallLayoutInited=false;
		}

		html5video_inited=false;
		lightbox_use=false;
		playlistLength=0;
		processPlaylistCounter = -1;
		processPlaylistLength=0;
		_videoProcessData=[];
		liProcessArr = [];
		_playlistManager.reSetCounter();

		descriptionArr = [];
		playlistArr=[];
		thumbArr=[];
		thumbImgArr=[];
		thumbPreloaderArr=[];
		thumbVideoDivArr = [];
		thumbHitDivArr=[];
		
		infoOpened=false;
		_thumbInnerContainerSize=0;

		if(playlistType!='wall'){
			if(scrollType == 'buttons'){
				if(playlistOrientation =='horizontal'){//reset scroll
					thumbInnerContainer.css('left', 0+'px');
				}else{
					thumbInnerContainer.css('top', 0+'px');
				}	
				//hide buttons
				if(thumbBackward)thumbBackward.css('display','none');
				if(thumbForward)thumbForward.css('display','none');
			}
		}
		
		if(playlist_list.find("div[id="+_activePlaylist+"]").length==0){
			if(!isEmpty(_activePlaylist)){
				alert('Failed playlist selection! No playlist with id: ' + _activePlaylist);
			}else{
				alert('Active playlist is set to none, so no playlist have been loaded.');
				checkPlaylistProcess();
			}
			_playlistTransitionOn=false;
			return false;
		}
		

		if(playlist_list.find("div[id="+_activePlaylist+"]").find("div[class='playlistNonSelected']").length == 0){
			alert('Playlist is empty. Quitting.');
			checkPlaylistProcess();
			_playlistTransitionOn=false;
			return false;
		};
		
		//check if playlist is xml
		if(playlist_list.find("div[id="+_activePlaylist+"]").find("div[class='playlistNonSelected']").eq(0).attr('data-type').toLowerCase() == 'xml'){
			
			remove_node = $(playlist_list.find("div[id="+_activePlaylist+"]")).find("div[class='playlistNonSelected']").eq(0);
			//console.log(remove_node);
			
			currentObj={};
			if(useDeeplink)currentObj.deeplink = remove_node.attr('data-address');
			
			_currentInsert=remove_node;//remember current insert index for append
			
			var url = remove_node.attr('data-mp4Path');
			//console.log('xml url = ',url);
			loadXml(url);

			return;
		}
		
		//check if playlist is folder
		if(playlist_list.find("div[id="+_activePlaylist+"]").find("div[class='playlistNonSelected']").eq(0).attr('data-type').toLowerCase() == 'folder'){
			
			folderProcessArr = [];//reset
			
			$(playlist_list.find("div[id="+_activePlaylist+"]")).find("div[class='playlistNonSelected']").each(function(){
				folderProcessArr.push($(this));
			});
			folderCounter = folderProcessArr.length;
			checkFolderCounter();

			return;
		}

		//get new playlist
		var playlist = playlist_list.find("div[id="+_activePlaylist+"]").clone().appendTo(playlist_content);
		//console.log(playlist, playlist.length);
		if(playlist.length==0){
			alert('Failed playlist selection 2! No playlist with id: ' + _activePlaylist);
			_playlistTransitionOn=false;
			return false;
		}
		
		currentCategory = activeCategory;
		
		deeplinkData = [];
		//deeplink data, not in build playlist since we execute it every time
		if(useDeeplink){
			getDeeplinkData=false;
			if(!useDeeplink && !activeCategory)activeCategory = playlist.index();
			if(!categoryArr[activeCategory].mediaName){//if not already processed
				getDeeplinkData=true;
				var tempArr=[];
				categoryArr[activeCategory].mediaName=tempArr;
			}
		}
		
		lastPlaylist = playlist;
		liProcessArr = playlist.find("div[class='playlistNonSelected']");
		//console.log(liProcessArr);

		//get playlist item size and thumb size
		var box = $("<div/>").addClass('playlistNonSelected').css('opacity',0).appendTo(playlistHolder);
	    boxMarginBottom = parseInt(box.css('marginBottom'),10);
		boxMarginRight = parseInt(box.css('marginRight'),10);
		boxWidth = box.outerWidth(true);
		boxHeight = box.outerHeight(true);
		box.remove();
		box=null;
		
		var thumb = $("<div/>").addClass('playlistThumb').css('opacity',0).appendTo(playlistHolder);
		thumbWidth = thumb.width();
		thumbHeight = thumb.height();
		thumb.remove();
		thumb=null;
		//console.log('boxWidth = ', boxWidth, ', boxHeight = ', boxHeight, ', thumbWidth = ', thumbWidth, ', thumbHeight = ', thumbHeight, 'boxMarginBottom = ', boxMarginBottom);
		
		processPlaylistLength = liProcessArr.length;
		//console.log('processPlaylistLength = ', processPlaylistLength);
		
		checkPlaylistProcess();
	}
	
	function checkPlaylistProcess() {
		processPlaylistCounter++;
		
		if(processPlaylistCounter < processPlaylistLength){
			_videoProcessData=[];//reset
			_processPlaylistItem();
		}else{
			//console.log('finished processing playlist');
			if(!flashCheckDone){
				flashCheckDone=true;
				
				yt_overlay_blocker=$("<div/>").addClass('yt_overlay_blocker').css({cursor:'pointer', opacity:0, left:-10000+'px'}).bind('click', function(){
					clickPlaylistItem2();
					return false;	
				}).appendTo(componentPlaylist).bind('mouseleave', outPlaylistItem);
				
				if(html5Support){
					$(flashMain).remove();
					flashPreviewHolder.remove();
					if(playlistType!='wall')mediaHolder.css('display', 'block');
				}else{
					youtubeIframeMain.remove();
					youtubeIframePreview.remove();
					mediaHolder.remove();
					if(playlistType!='wall'){
						yt_overlay_blocker.unbind('mouseleave', outPlaylistItem);//not needed in this case					
						if(typeof getFlashMovie(flashMain) !== "undefined"){
							$(flashMain).css('display','block');
							flashReadyIntervalID = setInterval(checkFlashReady, flashReadyInterval);	
						}else{
							checkPlaylistProcess();
						}
					}else{
						if(useLivePreview && typeof getFlashMovie(flashPreview) !== "undefined"){
							$(flashPreview).css('display','block');
							flashReadyIntervalID = setInterval(checkFlashReady2, flashReadyInterval);
						}else{
							checkPlaylistProcess();
						}
					}
					return;
				}
			}
			
			//console.log('finished processing playlist');
			playlistLength= playlistArr.length;
			//console.log(playlistArr);
			//console.log('playlistLength = ', playlistLength);
			
			$('.playlistInfo').dotdotdot();
			
			_playlistManager.setPlaylistItems(playlistLength);
			
			if(playlistType!='wall' && playlistLength>0){
			
				//remove margin on last playlist item
				if(playlistType == 'list'){
					if(playlistOrientation == 'vertical'){
						playlistArr[playlistLength-1].css('marginBottom', 0+'px');
					}else{
						playlistArr[playlistLength-1].css('marginRight', 0+'px');
					}
				}
				
				_thumbInnerContainerSize=0;
				var i = 0, div;
				for(i;i<playlistLength;i++){
					div = $(playlistArr[i]);
					if(playlistOrientation == 'horizontal'){
						_thumbInnerContainerSize+=div.outerWidth(true);
					}else{
						_thumbInnerContainerSize+=div.outerHeight(true);
					}
				}
				
				if(scrollType == 'buttons'){
					if(playlistOrientation == 'horizontal'){
						playlist_inner.width(_thumbInnerContainerSize);
					}
				}else if(scrollType == 'scroll'){
					if(playlistOrientation == 'horizontal'){
						lastPlaylist.width(_thumbInnerContainerSize);
					}
				}
			}
			
			if(playlistType!='wall'){
			
				checkScroll();
			
			}else{
				if(playlistType=='wall' && lightbox_use){//grab pp nodex per each playlist
					jQuery("a[data-rel^='prettyPhoto']").prettyPhoto({theme:'pp_default',
						deeplinking: false, 
						changepicturecallback: function(){ //called on prettyPhoto open
							if(!isMobile){
								if(currentPreviewID!=-1)itemTriggered(currentPreviewID);//for pp click playlist item wont happen
								else if(pp_currentPreviewID!=-1)itemTriggered(pp_currentPreviewID);
								cleanPreviewVideo();
							}
						},
						callback: function(){}//Called when prettyPhoto is closed 
					});	
				}
			}
			
			if(preloader.length)preloader.css('display','none');
			_playlistTransitionOn=false;	
			
			if(!_componentInited){
				_componentInited=true;
				_doneResizing();

				if(playlistType=='wall' && isMobile){//capture item number clicked on mobile for href links
					_doc.on("click", "a[data-apNumToReturn]", function() {   
						if($(this).attr('data-apNumToReturn') != undefined){
							var r = parseInt($(this).attr('data-apNumToReturn'),10);  
							itemTriggered(r);
						}
					});
				}
				
				if(playlistType!='wall'){
					if(autoHideControls){
						playerHolder.bind('mouseenter', overComponent).bind('mouseleave', outComponent);
					}else{
						showControls();
					}
				}
				if(useLivePreview && !playlistHidden){
					playlistHolder.bind('mouseleave', outPlaylist);
				}
				
				videoGallerySetupDone();
				
			}
			
			if(playlistType!='wall'){
				if(useDeeplink){
					//check second level
					if(secondLevelExist){
						if(!findCounterByName(secondLevel)){//if second level exist but invalid
							alert('404 page not found, check your deeplinks second level!');
							$.address.history(false);//skip invalid url
							return;	
						}
						//console.log(activeItem);
						_addressSet=true;
						_playlistManager.setCounter(activeItem, false);
					}
				}else{
					var ai = settings.activeItem;
					if(ai > playlistLength-1)ai = playlistLength-1;
					if(ai>-1){
						_playlistManager.setCounter(ai, false);
					}
				}
				showControls2();
			}
		}
	}
	
	function _processPlaylistItem() {
		//console.log('_processPlaylistItem, processPlaylistCounter = ', processPlaylistCounter);
		
		var _item, youtube_path, path, type, thumb, thumbImg, thumbPreloader, videoDiv, hitdiv, attr;
		_item = $(liProcessArr[processPlaylistCounter]);
		
		type = _item.attr('data-type');
	
		if(type == 'local'){

			var obj = {};
			obj.type = 'local';
			obj.mp4Path = _item.attr('data-mp4Path');
			obj.ogvPath = _item.attr('data-ogvPath');
			if(_item.attr('data-webmPath') != undefined && !isEmpty(_item.attr('data-webmPath'))){
				obj.webmPath = _item.attr('data-webmPath');
			}
			obj._item = _item;
			thumb = _item.find("div[class='playlistThumb']");//div
			obj.thumb = thumb;
			obj.thumbImg = thumb.find("img[class='thumb']");
			if(useDeeplink)obj.deeplink = _item.attr('data-address');
			_videoProcessData.push(obj);
			_buildPlaylist();
			
		}else if(type == 'youtube_single'){
			
			path = _item.attr('data-mp4Path');
			youtube_path="http://gdata.youtube.com/feeds/api/videos/"+path+"?v=2&format=5&alt=jsonc";
			
			currentObj={};
			attr = _item.attr('data-address');
			if (useDeeplink && typeof attr !== 'undefined' && attr !== false) {
				 currentObj.deeplink = attr;
			}
			attr = _item.attr('data-link');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.link = attr;
			}
			attr = _item.attr('data-hook');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.hook = attr;
			}
			attr = _item.attr('data-target');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.target = attr;
			}
			attr = _item.attr('data-description');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.description = attr;
			}
			if(_item.find('.playlistTitle').length>0){
				currentObj.title = _item.find('.playlistTitle').html();
			}
			if(_item.find('.thumb').length>0){
				currentObj.thumb = _item.find('.thumb').attr('src');
			}
			
			_processYoutube(type, youtube_path);
			
		}else if(type == 'youtube_playlist'){
			
			path = _item.attr('data-mp4Path');
			//check for 'PL'
			if(_item.attr('data-mp4Path').substr(0,2).toUpperCase() == 'PL'){
				//path = _item.attr('data-mp4Path').substring(2);
			}
			youtubePlaylistPath=path;
			//console.log(path);
			playlistStartCounter = 1;
			
			youtube_path = "http://gdata.youtube.com/feeds/api/playlists/"+youtubePlaylistPath+"?start-index="+playlistStartCounter+"&max-results=50&v=2&format=5&alt=jsonc";
			
			currentObj={};
			attr = _item.attr('data-address');
			if (useDeeplink && typeof attr !== 'undefined' && attr !== false) {
				 currentObj.deeplink = attr;
			}
			
			attr = _item.attr('data-link');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.link = attr;
			}
			attr = _item.attr('data-hook');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.hook = attr;
			}
			attr = _item.attr('data-target');
			if (typeof attr !== 'undefined' && attr !== false) {
				 currentObj.target = attr;
			}
			
			_currentInsert =_item;//remember current insert index for append
			_item.css('display','none');//hide data li
			
			_processYoutube(type, youtube_path);
			
		}else{
			alert('Wrong data-type in playlist! Playlist node data-type cannot be: "' + type + '" . Quitting.');
			if(type == 'xml' || type == 'folder'){
				alert('You CANNOT mix XML or FOLDER playlist with other playlist types (local videos, youtube single videos, youtube playlists). Quitting.');
			}
		}
	}
	
	function loadXml(path){
		var url = path+"?rand=" + (Math.random() * 99999999);
		
		$.ajax({
			type: "GET",
			url: url,
			dataType: "html",
			cache: false
		}).done(function(xml) {
		
			var obj, ul, li, _li, str;
		
			$(xml).find("div[class='playlistNonSelected']").each(function(){
			
				obj = $(this);
				
				str = $('<div>').append(obj.clone()).html();//convert object to string
				str = str.replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/\<br\>\<br\>/g, "<br\/>");//correct xml file from domdocument creation (<,>,br)
				//console.log(str);
			
				ul = document.createElement('ul');
				ul.innerHTML = str;
				li = ul.firstChild;
				//console.log(li);
				
				_li = $(li);
					
				_currentInsert.after(_li);
				_currentInsert=_li;
				
			});
			
			if(remove_node)remove_node.remove();
			_setPlaylist();	

		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert('XML process error: ' + jqXHR.responseText);
			checkPlaylistProcess();
		});	
	}
	
	function loadFolder(){
			
		var _item = folderProcessArr[folderCounter], path = _item.attr('data-mp4Path'), address = _item.attr('data-address'), sub_dirs = false;
		if (typeof _item.attr('data-subdirs') !== 'undefined' && _item.attr('data-subdirs') !== false) {
			 sub_dirs = true;
		}
		_currentInsert = _item;	
			
		if(playlistType=='wall'){
			path += wallPath;
		}else{
			path += mainPath;
		}
		path = path.replace(/\/\//g, "/");
		//console.log(url);
	
		var url = hap_source_path+'folder_parser.php', data = {"dir": path, "sub_dirs": sub_dirs}; 

		jQuery.ajax({
			type: 'GET',
			url: url,
			data: data,
			dataType: "json"
		}).done(function(media) {
			
			var li, div, thumb, no_ext, title, path, main_mp4, main_ogv, main_webm, main_jpg, preview_mp4, preview_ogv, preview_webm, preview_jpg, i = 0, len = media.length, entry, title, tw, th;
			//console.log(len);
			
			if(len == 0){
				alert('Folder process failed! No media found.');
				return;
			}
			
			if(playlistType == 'list'){
				div = $('<div class="playlistThumb thumb"/>').appendTo(mainWrapper);
			}else{
				div = $('<div class="playlistThumb thumb"/>').appendTo(componentWrapper);
			}
			tw = div.width(), th = div.height();
			div.remove();
			//console.log(div, tw,th);
			
			for(i; i < len; i++){
				entry = media[i];
				//console.log(entry);
				
				path = entry.path;
				
				if(path.indexOf('\\')){//replace backward slashes
					path = path.replace(/\\/g,"/");
				}
				
				main_mp4 = path;
				main_ogv = path.substr(0, path.lastIndexOf('.')) + '.ogv';//asssume ogv file exist with the same name!
				main_webm = path.substr(0, path.lastIndexOf('.')) + '.webm';//asssume webm file exist with the same name!
				main_jpg = path.substr(0, path.lastIndexOf('.')) + '.jpg';//asssume jpg file exist with the same name!
				
				preview_mp4 = path;
				preview_ogv = path.substr(0, path.lastIndexOf('.')) + '.ogv';//asssume ogv file exist with the same name!
				preview_webm = path.substr(0, path.lastIndexOf('.')) + '.webm';//asssume webm file exist with the same name!
				preview_jpg = path.substr(0, path.lastIndexOf('.')) + '.jpg';//asssume jpg file exist with the same name!
				
				preview_mp4 = preview_mp4.replace(mainPath, previewPath);//switch paths
				preview_ogv = preview_ogv.replace(mainPath, previewPath);//switch paths
				preview_webm = preview_webm.replace(mainPath, previewPath);//switch paths
				preview_jpg = preview_jpg.replace(mainPath, previewPath);//switch paths
				
				//create li node
				li = $('<div/>').addClass('playlistNonSelected').attr({'data-id': playlistLength-1, 'data-type': 'local', 
				'data-mp4Path': main_mp4,
				'data-ogvPath': main_ogv,
				'data-webmPath': main_webm,
				'data-imagePath': main_jpg});
				
				//get title from main path
				no_ext = main_mp4.substr(0, main_mp4.lastIndexOf('.'));
				if(no_ext.indexOf('/')){
					title = no_ext.substr(no_ext.lastIndexOf('/')+1);
				}else{
					title = no_ext;
				}
				//remove underscores from title 
				title = title.split("_").join(" ");
				
				//<div class="playlistThumb"><img class='thumb' src='../media/video/1/thumb/01.jpg' width='120' height='68' alt=''/></div>
				thumb = $('<div class="playlistThumb"><img class="thumb" src="'+preview_jpg+'" alt="'+title+'"/></div>').appendTo(li);
				//thumb = $('<div class="playlistThumb"><img class="thumb" src="'+preview_jpg+'" width="'+tw+'" height="'+th+'" alt="'+title+'"/></div>').appendTo(li);
				
				div = $('<div class="playlistInfo"><p><span class="playlistTitle">'+title+'</span></p></div>').appendTo(li);
				
				_currentInsert.after(li);
				_currentInsert=li;
				
				if(useDeeplink)li.attr('data-address', address+(i+1).toString());
			}
			
			_item.remove();
			checkFolderCounter();
			
		}).fail(function(jqXHR, textStatus, errorThrown) {
			alert('Folder process error: ' + jqXHR.responseText);
			alert('Make sure you are running this online or on local server, not offline!');
			checkPlaylistProcess();
		});
	}
	
	function checkFolderCounter() {
		folderCounter--;
		//console.log('checkFolderCounter, ', folderCounter);
		if(folderCounter>-1){
			loadFolder();
		}else{
			_setPlaylist();		
		}
	}
	
	function _processYoutube(type, path) {
		//console.log('_processYoutube: ', type, path);
		jQuery.ajax({
			 url: path,
			 dataType: 'jsonp', 
			 success:function(data){
				 type == 'youtube_single' ? _processYoutubeSingleSuccess(data) : _processYoutubeSuccess(data);
			 },
			 error:function(er){
				 _processYoutubeError(er);
			 }
		});	
	}
	function _processYoutubeSuccess(response) {//for playlist
		 //console.log('_processYoutubeSuccess');
		 //console.log(response);
		
		 if(response.error){
			alert(response.error.message);
			checkPlaylistProcess();
			return;	
		 } 
		 
		 if(response.data.items){
		 
			 var len = response.data.items.length, i = 0, _item, type, path;
			 //console.log('response.data.items.length = ', len);
			 
			 for(i; i < len; i++){
				_item = response.data.items[i].video;
				
				if(!_item || !_item.accessControl){//skip deleted, private videos
					//http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
					//https://developers.google.com/youtube/2.0/developers_guide_protocol_uploading_videos#Setting_Access_Controls
					//console.log(i, _item.status.value);	
					continue;
				}
				
				obj = {};
				obj.type = 'youtube_playlist';
				if(useDeeplink)obj.deeplink = currentObj.deeplink+(i+1).toString();
				obj.id = _item.id;
				//console.log(i, _item.id, _item.title, _item.thumbnail);
				if(!currentObj.title){
					obj.title=_item.title?_item.title:'';
				}else{
					obj.title=currentObj.title;
				}
				if(!currentObj.description){
					obj.description=_item.description?_item.description:'';
				}else{
					obj.description=currentObj.description;
				}
				if(!currentObj.thumb && _item.thumbnail){
					obj.thumbnail=_item.thumbnail.sqDefault ? _item.thumbnail.sqDefault : _item.thumbnail.hqDefault;
				}else if(currentObj.thumb){
					obj.thumbnail=currentObj.thumb; 
				}else{
					obj.thumbnail='';  
			    }
				
				_videoProcessData.push(obj); 
			 }
			 
			 playlistStartCounter += playlistEnlargeCounter;
			 //console.log('playlistStartCounter = ', playlistStartCounter);
			 
			 type = 'youtube_playlist';
			 path = "http://gdata.youtube.com/feeds/api/playlists/"+youtubePlaylistPath+"?start-index="+playlistStartCounter+"&max-results=50&v=2&format=5&alt=jsonc";
			_processYoutube(type, path);
		 
		 }else{//on the end
			_buildPlaylist();
		 }
	}
	
	function _processYoutubeSingleSuccess(response) {
		 //console.log(response);
		 /*
		 console.log(response.data);
		 console.log(response.data.title);
		 console.log(response.data.description);
		 console.log(response.data.id);
		 console.log(response.data.thumbnail.sqDefault);
		 console.log(response.data.thumbnail.hqDefault);
		 */
		 
		 var obj = {}, _item;
		 _item = response.data;
		 
		 if(!_item){
			checkPlaylistProcess();
			return;	 
		 }
		 
		 if(!_item.accessControl){//skip deleted, private videos
			//http://apiblog.youtube.com/2011/12/understanding-playback-restrictions.html
			//https://developers.google.com/youtube/2.0/developers_guide_protocol_uploading_videos#Setting_Access_Controls
			//console.log(_item.status.value);
			checkPlaylistProcess();
		 }else{
			 obj.type = 'youtube_single';
			 if(useDeeplink)obj.deeplink = currentObj.deeplink;
			 obj.id = _item.id;
			 if(!currentObj.title){
				 obj.title=_item.title?_item.title:'';
			 }else{
				 obj.title=currentObj.title;
			 }
			 if(!currentObj.description){
				 obj.description=_item.description?_item.description:'';
			 }else{
				 obj.description=currentObj.description;
			 }
			 if(!currentObj.thumb && _item.thumbnail){
				 obj.thumbnail=_item.thumbnail.sqDefault ? _item.thumbnail.sqDefault : _item.thumbnail.hqDefault;
			 }else if(currentObj.thumb){
				 obj.thumbnail=currentObj.thumb; 
			 }else{
				 obj.thumbnail='';  
			 }
			 _videoProcessData.push(obj);
			 
			_buildPlaylist();
		 }
	}

	function _processYoutubeError(er) {
		//console.log(er);
		checkPlaylistProcess();
	}
	
	//************
	
	function _buildPlaylist() {
		//console.log('_buildPlaylist');
		
		var len = _videoProcessData.length, i = 0, ul, li, _item, type, div, thumb, thumbImg, thumbPreloader, videoDiv, hitdiv, loc_path, loc_name, p, a, img;
		//console.log('len = ', len);
		
		if(getDeeplinkData){
			dlink = baseURL + strict + firstLevel + '/';
			var str_to_filter, tempArr = categoryArr[activeCategory].mediaName;
		}
		
		for (i; i < len; i++) {
			
			_item = _videoProcessData[i];
			
			type = _item.type;
			playlistLength+=1;
			
			var mc = playlistLength-1;
			
			//console.log(_item, type);
			
			if(type == 'local'){
				
				playlistArr.push(_item._item);
				
				//bring orig youtube types back (they were initailly marked as 'local' because all xml nodes were created in php before coming to this file, but we still need yt type because of other actions like over playlist item)
				if(_item._item.attr('data-orig-type') != undefined && !isEmpty(_item._item.attr('data-orig-type'))){
					if(!autoMakePlaylistThumb)if(_item.thumb)_item.thumb.remove();
					if(!autoMakePlaylistInfo){
						if(_item._item.find('.playlistInfo').length)_item._item.find('.playlistInfo').remove();
						_item._item.attr('data-description','');
					}
					_item._item.attr('data-type', _item._item.attr('data-orig-type')); 
				}
				
				//check description
				if(_item._item.attr('data-description') != undefined && !isEmpty(_item._item.attr('data-description'))){
					descriptionArr[playlistLength-1] = _item._item.attr('data-description');
				}
				
				if(_item.thumb){
					thumb = _item.thumb;//div
					thumbArr.push(thumb);
					thumbImg = _item.thumbImg;//img
					thumbImgArr.push(thumbImg);
					//fade thumbs in
					thumbImg.stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
				}

				//hit 
				hitdiv =$("<div/>").css({//hit div for rollover over whole playlist item
				   position: 'absolute',
				   width: boxWidth + 'px',
				   height: boxHeight + 'px',
				   top : 0+'px',
				   left : 0+'px',
				   background: '#ad4',
				   cursor: 'pointer',
				   opacity: 0
				}).attr('dataTitle', 'hitdiv');//hit on top
				
				if(playlistType!='wall'){
					hitdiv.appendTo(_item._item);	
					thumbHitDivArr[playlistLength-1]=hitdiv;
					_item._item.bind('click', clickPlaylistItem).attr('data-id', playlistLength-1);
				}else{
					
					var lnk;
					if(_item._item.attr('data-link') != undefined){
						lnk = _item._item.attr('data-link');
					}
					var hook;
					if(_item._item.attr('data-hook') != undefined){
						hook = _item._item.attr('data-hook');
					}
					var desc = '';
					if(_item._item.attr('data-description') != undefined){
						desc = _item._item.attr('data-description');
					}	
					var tlt = '';
					if(_item._item.find("span[class='playlistTitle']").length){
						tlt = _item._item.find("span[class='playlistTitle']").html();
					}
					
					if(hook!=undefined && lnk!=undefined){//pretyphoto
						lightbox_use=true;
						//create prettyphoto nodes
						/*
						<a class="pp_content" href="http://vimeo.com/14665315" data-rel="prettyPhoto[gallery1]" title="Optional description in Prettyphoto."><img src="link/to/image" width="180" height="120" alt="Optional title in Prettyphoto." /></a>  
						*/
						if(html5Support){
							//console.log(lnk, hook, desc, tlt);
							a = $('<a href="'+lnk+'" data-rel="'+hook+'" title="'+desc+'" />').appendTo(_item._item);
							img = $('<img src="" alt="'+tlt+'"/>').css('display','none').appendTo(a);//we use empty image for prettyphoto title
							hitdiv.appendTo(a);	
							if(isMobile){
								hitdiv.bind('click', function(){//to capture itemTriggered on pp
									itemTriggered($(this).attr('data-id'));
								}).attr('data-id', playlistLength-1);
							}
						}else{//flash
							var ytb=$("<div/>").addClass('yt_overlay_blocker').css({cursor:'pointer', opacity:0, left:-10000+'px'});
							a = $('<a href="'+lnk+'" data-rel="'+hook+'" title="'+desc+'"/>').data('yt_blocker', ytb).appendTo(componentPlaylist);
							img = $('<img src="" alt="'+tlt+'"/>').css('display','none').appendTo(a);//we use empty image for prettyphoto title
							yt_wall_pp_arr[ playlistLength-1] = a;//store them so we can wrap yt_overlay_blocker in them
							ytb.appendTo(a);
							if(!isMobile){
								ytb.bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
							}
							thumbHitDivArr[playlistLength-1]=ytb;
						}
					}else if(lnk!=undefined){//link
						var target = '_blank';
						if(_item._item.attr('data-target') != undefined && !isEmpty(_item._item.attr('data-target'))){
							target = _item._item.attr('data-target');
						}
						if(html5Support){
							a = $('<a href="'+lnk+'" target="'+target+'" data-apNumToReturn="'+mc+'"/>').appendTo(_item._item);
							hitdiv.appendTo(a);	
							if(!isMobile){
								hitdiv.bind('click', function(){//to capture itemTriggered on link
									if(currentPreviewID!=-1)itemTriggered(currentPreviewID);
									else if(pp_currentPreviewID!=-1)itemTriggered(pp_currentPreviewID);
								}).attr('data-id', playlistLength-1);
							}
						}else{//flash
							var ytb=$("<div/>").addClass('yt_overlay_blocker').css({cursor:'pointer', opacity:0, left:-10000+'px'});
							a = $('<a href="'+lnk+'" target="'+target+'"/>').data('yt_blocker', ytb).appendTo(componentPlaylist);
							yt_wall_pp_arr[ playlistLength-1] = a;//store them so we can wrap yt_overlay_blocker in them
							ytb.appendTo(a);
							if(!isMobile){
								ytb.bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
							}
							thumbHitDivArr[playlistLength-1]=ytb;
							
							if(!isMobile){
								ytb.bind('click', function(){//to capture itemTriggered on link
									if(currentPreviewID!=-1)itemTriggered(currentPreviewID);
									else if(pp_currentPreviewID!=-1)itemTriggered(pp_currentPreviewID);
								}).attr('data-id', playlistLength-1);
							}
						}
					}else{//no action
						hitdiv.appendTo(_item._item);	
						thumbHitDivArr[playlistLength-1]=hitdiv;
						_item._item.bind('click', clickPlaylistItem).data('no_action', 'true').attr('data-id', playlistLength-1);
					}
				
				}
				
				if(!isMobile){
					if(html5Support){
						_item._item.bind('mouseenter', overPlaylistItem).bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
					}else{
						_item._item.bind('mouseenter', overPlaylistItem).attr('data-id', playlistLength-1);
					}
				}
			
				if(useLivePreview){
					//video holder
					videoDiv =$("<div/>").addClass('thumb_vid').attr({
					   dataTitle: 'videoDiv'
					}).appendTo($(thumbArr[playlistLength-1]));
					thumbVideoDivArr[playlistLength-1]=videoDiv;
				
					//thumb preloaders
					thumbPreloader=$(new Image()).attr('data-id', playlistLength-1).addClass('thumbPreloader').load(function() {
					}).error(function(e) {
						//console.log("thumb error " + e);
					}).attr({
					  src: thumbnailPreloaderUrl,
					  dataTitle: 'thumbPreloader'
					}).appendTo(thumbArr[playlistLength-1]);
					thumbPreloaderArr[playlistLength-1] = thumbPreloader;
				}
			
			}else if(type == 'youtube_single' || type == 'youtube_playlist'){
				if(type == 'youtube_single'){
					//youtube single already has li node, so just append other necessary attributtes and stuff into it.
					//li = $(liProcessArr[playlistLength-1]);
					li = $(liProcessArr[processPlaylistCounter]);
				}else if(type == 'youtube_playlist'){	
					//create nodes here
					/*
					<li data-address="youtube_single1" class='playlistNonSelected' data-type='youtube_single' data-mp4Path="jYYV0MEAhzU" ><div class="playlistThumb"></div><div class='playlistTitle'>Video title goes here</div><div class="playlistContent">Commodo vitae, commodo in, tempor eu, urna. Etiam justo ipsum maecenas nec tellus.</div></li>
					*/
					li = $('<li/>').addClass('playlistNonSelected').attr({'data-id': playlistLength-1, 'data-type': _item.type, 'data-mp4Path': _item.id});
					_currentInsert.after(li);
					_currentInsert=li;
					if(useDeeplink)li.attr('data-address', _item.deeplink);
				}
				
				
				playlistArr.push(li);
				
				//thumb
				if(autoMakePlaylistThumb){
					if(li.find('.playlistThumb').length>0)li.find('.playlistThumb').remove();
					div = $('<div/>').addClass('playlistThumb').appendTo(li);
					thumb = div;//div
					thumbArr.push(thumb);
					
					//load youtube thumbs
					if(_item.thumbnail){
						thumbImg=$(new Image()).css('opacity',0).attr('data-id', playlistLength-1).load(function() {
							//console.log($(this).width(), $(this).height());
							$(this).addClass('thumb_yt').stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
						}).error(function(e) {
							//console.log("thumb error " + e);
						}).attr({
						  src: _item.thumbnail
						}).appendTo(thumb);
						thumbImgArr.push(thumbImg);//img
					}else{
						thumbImgArr.push('');
					}
				}else{
					//search for thumbs, if added manually
					thumb = li.find("div[class='playlistThumb']");//div
					if(thumb){
						thumbArr.push(thumb);
						thumbImg = thumb.find("img[class='thumb']");
						if(thumbImg){
							thumbImg.stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
							thumbImgArr.push(thumbImg);//img
						}
					}
				}
				
				//title, description
				if(playlistType!='wall'){
					if(autoMakePlaylistInfo){
						//console.log(_item.title, _item.description);
						var tt = _item.title?_item.title:'', dd = _item.description?_item.description:'';
						if(playlistType=='list'){
							p=$('<p><span class="playlistTitle">'+tt+'</span><br><span class="playlistContent">'+dd+'</span></p>');
						}
						if(li.find('.playlistTitle').length==0){
							div = $('<div/>').html(p).addClass('playlistInfo').appendTo(li);
						}else{
							//already has title, playlist content node	
							if(playlistType=='list'){
								li.find('.playlistTitle').html(tt);
								li.find('.playlistContent').html(dd);
							}else{
								li.find('.playlistTitle').html(tt);
							}
						}
							
						li.attr('data-description', dd);
						descriptionArr[playlistLength-1] = dd;
					}else{
						//search for description (big description over video), if added manually
						if(li.attr('data-description') != undefined && !isEmpty(li.attr('data-description'))){
							descriptionArr[playlistLength-1] = li.attr('data-description');
						}
					}
				}
				
				//hit 
				hitdiv =$("<div/>").css({//hit div for rollover over whole playlist item
				   position: 'absolute',
				   width: boxWidth + 'px',
				   height: boxHeight + 'px',
				   top : 0+'px',
				   left : 0+'px',
				   background: '#ad4',
				   cursor: 'pointer',
				   opacity: 0
				}).attr('dataTitle', 'hitdiv');//hit on top
				
				if(playlistType!='wall'){
					hitdiv.appendTo(li);	
					thumbHitDivArr[playlistLength-1]=hitdiv;
					li.bind('click', clickPlaylistItem).attr('data-id', playlistLength-1);
				}else{
					
					var lnk = currentObj.link ? currentObj.link : undefined;
					var hook = currentObj.hook ? currentObj.hook : undefined;
					//console.log(lnk,hook);
					if(type == 'youtube_playlist'){
						/*with yt playlist, if just hook exist make prettyphoto links to yt video id's, if just link exist make links (but all will have to point to the same link)*/
						if(hook!=undefined)lnk='id';//set it to something not undefined so it gets selected as pp action
					}
					var desc = _item.description?_item.description:'';
					//description limit
					if(desc.length>70)desc=desc.substring(0,70)+'...';
					var tlt = _item.title?_item.title:'';
					//title limit
					if(tlt.length>30)tlt=tlt.substring(0,30)+'...';
					
					var toAppend = componentPlaylist;
					var xpos = -10000;
					
					if(hook!=undefined && lnk!=undefined){//pretyphoto
						if(!useLivePreview){
							toAppend=li;
							xpos=0;
						}
						lightbox_use=true;
						//create prettyphoto nodes
						/*
						<a class="pp_content" href="http://vimeo.com/14665315" data-rel="prettyPhoto[gallery1]" title="Optional description in Prettyphoto."><img src="link/to/image" width="180" height="120" alt="Optional title in Prettyphoto." /></a>  
						*/
						//for youtube wall place all blockers wrapped in prettyphoto in componentPlaylist, hide them on the left and on each preview video, show the one it belongs to.
						if(type == 'youtube_playlist')lnk = 'http://www.youtube.com/watch?v='+_item.id;
						
						var ytb=$("<div/>").addClass('yt_overlay_blocker').css({cursor:'pointer', opacity:0, left:xpos+'px'});
						a = $('<a href="'+lnk+'" data-rel="'+hook+'" title="'+desc+'"/>').data('yt_blocker', ytb).appendTo(toAppend);
						img = $('<img src="" alt="'+tlt+'"/>').css('display','none').appendTo(a);//we use empty image for prettyphoto title

						yt_wall_pp_arr[ playlistLength-1] = a;//store them so we can wrap yt_overlay_blocker in them
						ytb.appendTo(a);
						
						if(!isMobile){
							ytb.bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
						}else{
							ytb.bind('click', function(){//to capture itemTriggered on link
								itemTriggered($(this).attr('data-id'));
							}).attr('data-id', playlistLength-1);
						}
						thumbHitDivArr[playlistLength-1]=ytb;

					}else if(lnk!=undefined){//link
						if(!useLivePreview){
							toAppend=li;
							xpos=0;
						}
						
						var target = '_blank';
						if(currentObj.target){
							target = currentObj.target;
						}
						
						var ytb=$("<div/>").addClass('yt_overlay_blocker').css({cursor:'pointer', opacity:0, left:xpos+'px'});
						a = $('<a href="'+lnk+'" target="'+target+'" data-apNumToReturn="'+mc+'"/>').data('yt_blocker', ytb).appendTo(toAppend);

						yt_wall_pp_arr[ playlistLength-1] = a;//store them so we can wrap yt_overlay_blocker in them
						ytb.appendTo(a);
						
						if(!isMobile){
							ytb.bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
						}
						thumbHitDivArr[playlistLength-1]=ytb;
						
						if(!isMobile){
							ytb.bind('click', function(){//to capture itemTriggered on link
								if(currentPreviewID!=-1)itemTriggered(currentPreviewID);
								else if(pp_currentPreviewID!=-1)itemTriggered(pp_currentPreviewID);
							}).attr('data-id', playlistLength-1);
						}
						
					}else{//no action
						hitdiv.appendTo(li);	
						thumbHitDivArr[playlistLength-1]=hitdiv;
						li.bind('click', clickPlaylistItem).data('no_action', 'true').attr('data-id', playlistLength-1);		
					}
				}
				
				if(!isMobile){
					li.bind('mouseenter', overPlaylistItem).bind('mouseleave', outPlaylistItem).attr('data-id', playlistLength-1);
				}
			
				if(useLivePreview){
					//video holder
					videoDiv =$("<div/>").addClass('thumb_vid').attr({
					   dataTitle: 'videoDiv'
					}).appendTo($(thumbArr[playlistLength-1]));
					thumbVideoDivArr[playlistLength-1]=videoDiv;
					
					//thumb preloaders
					thumbPreloader=$(new Image()).attr('data-id', playlistLength-1).addClass('thumbPreloader').load(function() {
					}).error(function(e) {
						//console.log("thumb error " + e);
					}).attr({
					  src: thumbnailPreloaderUrl,
					  dataTitle: 'thumbPreloader'
					}).appendTo(thumbArr[playlistLength-1]);
					thumbPreloaderArr[playlistLength-1] = thumbPreloader;
				}
			}
			
			//deeplinks
			if(useDeeplink && getDeeplinkData){
				str_to_filter = filterAllowedChars(_item.deeplink);
				//console.log(str_to_filter);
				tempArr.push(str_to_filter);
			}
			
			if(_item.type == 'local'){
				if(mp4Support){
					loc_path = _item.mp4Path;
				}else if(vorbisSupport){
					loc_path = _item.ogvPath;
				}else if(webmSupport){
					if(_item.webmPath)loc_path = _item.webmPath;
				}
				if(loc_path.lastIndexOf('/')){
					loc_name = loc_path.substr(loc_path.lastIndexOf('/')+1);
				}else{
					loc_name = loc_path;
				}
				deeplinkData.push({'id': playlistLength, 'name': loc_name, 'type':_item.type ,'video-id': loc_path, 'deeplink': useDeeplink ? dlink+_item.deeplink : 'undefined'});
			}else{
				li.attr('data-title', _item.title?_item.title:'');
				deeplinkData.push({'id': playlistLength, 'name': _item.title?_item.title:'', 'type':_item.type ,'video-id': _item.id, 'deeplink': useDeeplink ? dlink+_item.deeplink : 'undefined'});
			}
		}
		checkPlaylistProcess();
	}
	

	function togglePlaylist(dir){
		if(!_componentInited || _playlistTransitionOn) return false;
		//console.log('togglePlaylist');
		if(dir===undefined){
			playlistHolder.css('display')=='block' ? dir = 'off' : 'on';
		}
		if(playlistType=='list'){
			if(dir=='off'){
				playlistHolder.css('display','none');
				playlistOpened=false;
			}else{
				playlistHolder.css('display','block');
				playlistOpened=true;
				if(scrollPaneRedo){//fix, cant reinit scrollpane while css display is none
					checkScroll();
					scrollPaneRedo=false;	
				}
			}	
		}
	}
	
	//**************** PREVIEW VIDEO
	
	function adjustPreviewVideo(){
		//console.log('adjustPreviewVideo');
		if(activePlaylistThumb){
			
			//calculate video relative position
			var x4 = parseInt(activePlaylistThumb.css('borderLeftWidth'),10);
			var x41 = parseInt(activePlaylistThumb.css('marginLeft'),10);
			var x42 = parseInt(activePlaylistThumb.css('paddingLeft'),10);
			
			var cp_x1 = parseInt(componentPlaylist.css('borderLeftWidth'),10);
			var cp_x2 = parseInt(componentPlaylist.css('marginLeft'),10);
			var cp_x3 = parseInt(componentPlaylist.css('paddingLeft'),10);

			var y4 = parseInt(activePlaylistThumb.css('borderTopWidth'),10);
			var y41 = parseInt(activePlaylistThumb.css('marginTop'),10);
			var y42 = parseInt(activePlaylistThumb.css('paddingTop'),10);
			
			var cp_y1 = parseInt(componentPlaylist.css('borderTopWidth'),10);
			var cp_y2 = parseInt(componentPlaylist.css('marginTop'),10);
			var cp_y3 = parseInt(componentPlaylist.css('paddingTop'),10);
			
			if(!activePlaylistThumb.offset()){
				//console.log('!activePlaylistThumb.offset() = ', activePlaylistThumb.offset());
				return false;
			} 
			
			var t1 = parseInt(activePlaylistThumb.offset().left,10) - parseInt(componentPlaylist.offset().left,10) + x4 + x41 + x42 + cp_x1+cp_x2+cp_x3;
			var t2 = parseInt(activePlaylistThumb.offset().top,10)- parseInt(componentPlaylist.offset().top,10) + y4 + y41 + y42 + cp_y1+cp_y2+cp_y3;
			
			//console.log('adjustPreviewVideo: ', 't1 = ', t1, ' , t2 = ', t2);
			
			if(mediaPreviewType == 'local'){
				if(no_action_item && yt_overlay_blocker)yt_overlay_blocker.css({left: t1+'px', top: t2+'px'});	
				if(current_wall_yt_blocker)current_wall_yt_blocker.css({left: t1+'px', top: t2+'px'});
				flashPreviewHolder.css({left: t1+'px', top: t2+'px'});
			}else if(mediaPreviewType == 'youtube_single' || mediaPreviewType == 'youtube_playlist'){
				if(html5Support){
					if(playlistType=='wall'){
						if(no_action_item && yt_overlay_blocker)yt_overlay_blocker.css({left: t1+'px', top: t2+'px'});
						if(current_wall_yt_blocker)current_wall_yt_blocker.css({left: t1+'px', top: t2+'px'});
						if(wallLayoutInited)youtubeIframePreview.css({left: t1+'px', top: t2+'px'});
					}else{
						if(yt_overlay_blocker)yt_overlay_blocker.css({left: t1+'px', top: t2+'px'});
						youtubeIframePreview.css({left: t1+'px', top: t2+'px'});
					}
				}else{
					if(no_action_item && yt_overlay_blocker)yt_overlay_blocker.css({left: t1+'px', top: t2+'px'});
					if(current_wall_yt_blocker)current_wall_yt_blocker.css({left: t1+'px', top: t2+'px'});
					flashPreviewHolder.css({left: t1+'px', top: t2+'px'});
				}
			}
		}
	}
	
	function overPlaylistItem(e){
		if(!_componentInited || _playlistTransitionOn) return false;
		
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		
		var attr = currentTarget.attr('data-orig-type');
		if (useLivePreview && typeof attr !== 'undefined' && attr !== false) {
			 if(currentTarget.attr('data-orig-type') == 'youtube_single' && !autoMakePlaylistThumb) return false;
		}
		
		var id = parseInt(currentTarget.attr('data-id'),10);
		if(id == _playlistManager.getCounter() || id == currentPreviewID) return false;//active item
		
		currentPreviewID = id;//prevent double rollover
		pp_currentPreviewID = id;
		
		if(playlistType=='wall'){
			no_action_item= false;//reset
			if(currentTarget.data('no_action'))no_action_item= true;
		}
		//console.log('no_action_item = ', no_action_item);
		
		mediaPreviewType=currentTarget.attr('data-type');
		
		if(playlistType!='wall'){
			currentTarget.removeClass('playlistNonSelected').addClass('playlistSelected');
		}
		
		if(useLivePreview){
			
			activePlaylistID = id;
			activePlaylistThumb = $(thumbArr[id]);
			activePlaylistHit = $(thumbHitDivArr[id]);
			//hide thumb
			activePlaylistThumbImg = $(thumbImgArr[id]).stop().animate({'opacity': 0},  {duration: 500, easing: "easeOutSine"});
			//show preloader
			activePlaylistPreloader = $(thumbPreloaderArr[id]).css('display','block');
			//video div
			activePlaylistVideoDiv=$(thumbVideoDivArr[id]);
			
			//console.log(activePlaylistID);
			
			var use_ogv=false;
			if(mp4Support){
				previewMediaPath = $(playlistArr[id]).attr('data-mp4Path').replace(mainPath, previewPath);
			}else{
				if(!useWebmVideoFormat && vorbisSupport && $(playlistArr[id]).attr('data-ogvPath') != undefined){
					previewMediaPath = $(playlistArr[id]).attr('data-ogvPath').replace(mainPath, previewPath);
					use_ogv=true;
				}else if(useWebmVideoFormat && webmSupport && $(playlistArr[id]).attr('data-webmPath') != undefined){
					previewMediaPath = $(playlistArr[id]).attr('data-webmPath').replace(mainPath, previewPath);
				}else{
					alert('No supported video format found for preview video. Quitting.');	
					return false;
				}
			} 
			
			if(html5Support){
				if(mediaPreviewType == 'local'){
					var videoCode='';
					videoCode += '<video class="preview_video_cont" width="'+thumbWidth+'" height="'+thumbHeight+'" preload="auto" >';
					videoCode += '<source src="'+previewMediaPath+'" />';
					videoCode += '</video>';

					if(!isAndroid){//no type on android
						var append;
						if(mp4Support){
							append = 'type="video/mp4"';
						}else if(use_ogv){
							append = 'type="video/ogg"';
						}else{
							append = 'type="video/webm"';
						}
						var m = videoCode.match(/\/\>/);//closing source tag
						videoCode = videoCode.slice(0, m.index) + append + videoCode.slice(m.index);
					}
					//console.log(videoCode);

					activePlaylistVideoDiv.html(videoCode);
					previewVideo = activePlaylistVideoDiv.find('.preview_video_cont');//get player reference
					previewVideoUp2Js = previewVideo[0];
					
					previewVideo.bind("ended", previewVideoEndHandler).bind("canplaythrough", previewCanplaythroughHandler)
					.bind("canplay", previewCanplayHandler);
				}else{//youtube
					ytMediaPath = $(playlistArr[id]).attr('data-mp4Path');
					//console.log('ytMediaPath = ',ytMediaPath);
					if(isIE){
						youtubeIframePreview.css({
							left:-10000+'px',
							width:600+'px',
							height:400+'px'
						});
					}
					if(playlistType=='wall'){
						if(current_wall_yt_blocker) current_wall_yt_blocker.css('left',-10000+'px');
						if(yt_wall_pp_arr[id])current_wall_yt_blocker = yt_wall_pp_arr[id].data('yt_blocker');
						//add it immediatelly for wall layout so that prettyphoto is accessible before yt movie starts
						if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
						scrollCheckIntervalID = setInterval(adjustPreviewVideo, scrollCheckInterval);
					}
					_initYoutubePreview();
				}
			}else{
				if(playlistType=='wall'){
					if(current_wall_yt_blocker) current_wall_yt_blocker.css('left',-10000+'px');
					if(yt_wall_pp_arr[id])current_wall_yt_blocker = yt_wall_pp_arr[id].data('yt_blocker');
					//add it immediatelly for wall layout so that prettyphoto is accessible before yt movie starts
					if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
					scrollCheckIntervalID = setInterval(adjustPreviewVideo, scrollCheckInterval);
				}
				previewMediaPath = $(playlistArr[id]).attr('data-mp4Path'); 
				previewMediaPath = previewMediaPath.replace(mainPath, previewPath);//switch paths
				if(mediaPreviewType == 'local'){
					if(typeof getFlashMovie(flashPreview) !== "undefined")getFlashMovie(flashPreview).pb_play( previewMediaPath, 2, thumbWidth, thumbHeight, 'local');
				}else{
					if(typeof getFlashMovie(flashPreview) !== "undefined")getFlashMovie(flashPreview).pb_play( previewMediaPath, 2, thumbWidth, thumbHeight, 'youtube');
				}
			}
		}
		return false;
	}
	
	function previewVideoEndHandler(){
		//console.log('previewVideoEndHandler');
		try{
			previewVideoUp2Js.currentTime=0;//rewind
		}catch(er){}
		previewVideoUp2Js.play();//chrome fix
	}
	
	function previewCanplaythroughHandler(){
		initPreviewVideo();
	}
	
	function previewCanplayHandler(){
		initPreviewVideo();
	}
	
	function initPreviewVideo(){
		//console.log('initPreviewVideo');
		if(previewVideo){
			previewVideo.unbind("canplaythrough", previewCanplaythroughHandler).unbind("canplay", previewCanplayHandler);
		}
		//hide preloader
		if(activePlaylistPreloader) activePlaylistPreloader.css('display','none');
		//play video
		if(previewVideoUp2Js) previewVideoUp2Js.play();
	}
	
	function cleanPreviewVideo(){
		//console.log('cleanPreviewVideo');
		if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
		
		if(html5Support){
			if(mediaPreviewType == 'local'){
				if(previewVideo){
					previewVideo.unbind("ended", previewVideoEndHandler).unbind("canplaythrough", previewCanplaythroughHandler).unbind("canplay", previewCanplayHandler).find('source').attr('src','');
				}
				//clean video code
				if(activePlaylistVideoDiv) activePlaylistVideoDiv.html('');
			}else{//youtube
				if(youtubeIframePreview)youtubeIframePreview.css('left',-10000+'px');
				if(isIE){
					if(_youtubePreviewPlayer) _youtubePreviewPlayer.clean();	
				}else{
					if(_youtubePreviewPlayer) _youtubePreviewPlayer.stop();	
				}
				if(current_wall_yt_blocker) current_wall_yt_blocker.css('left',-10000+'px');
				if(yt_overlay_blocker)yt_overlay_blocker.css('left',-10000+'px');
				wallLayoutInited=false;
			}
		}else{
			if(((typeof getFlashMovie(flashPreview) !== "undefined") && (getFlashMovie(flashPreview).pb_dispose))getFlashMovie(flashPreview).pb_dispose();
			//flashPreviewHolder.css('display','none');
			flashPreviewHolder.css('left',-10000+'px');//fix for safari problem above (display: none)
			if(current_wall_yt_blocker) current_wall_yt_blocker.css('left',-10000+'px');
			if(yt_overlay_blocker)yt_overlay_blocker.css('left',-10000+'px');
			wallLayoutInited=false;
		}
		//hide preloader
		if(activePlaylistPreloader) activePlaylistPreloader.css('display','none');
		//show thumb
		if(activePlaylistThumbImg) activePlaylistThumbImg.stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
		
		if(isIE && ieBelow9){//rollout fix
			if(playlistType!='wall'){
				var k = _playlistManager.getCounter(), m = 0, pi;
				for(m;m<playlistLength;m++){
					if(m != k){
						pi = $(playlistArr[m]);
						if(pi){
							pi.removeClass('playlistSelected').addClass('playlistNonSelected');
						}
					}
				}
			}
		}
		currentPreviewID=-1;//reset
		//console.log('cleanPreviewVideo');
	}
	
	function outPlaylistItem(e){
		//console.log('outPlaylistItem 0');
		
		if(!_componentInited || _playlistTransitionOn) return false;
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		if(id == _playlistManager.getCounter()) return false;//active item
		
		if(useLivePreview){
			//youtube and flash for ie<9 is a single movie which lies above playlist items, so we have to use hit test point to avoid preview restart when we rollover over actual movie again while still being over playlist item.
			
			if(mediaPreviewType == 'local'){
				if(html5Support){
					cleanPreviewVideo();
				}else{
					if(playlistType!='wall'){
						//hit test point preview movie
						if(activePlaylistHit){
							var t1 = parseInt(activePlaylistHit.offset().left,10) - parseInt(componentPlaylist.offset().left,10),
								t2 = parseInt(activePlaylistHit.offset().top,10)- parseInt(componentPlaylist.offset().top,10),
								d1 = e.pageX - parseInt(componentPlaylist.offset().left,10),
								d2 = e.pageY - parseInt(componentPlaylist.offset().top,10);
	
							if(d1 > t1 && d1 < t1 + boxWidth - boxMarginRight && d2 > t2 && d2 < t2 + boxHeight - boxMarginBottom){
								//console.log('isnt rollout, over flash preview');
								return false;
							}else{
								cleanPreviewVideo();
							}
						}else{
							cleanPreviewVideo();
						}
					}else{
						if(no_action_item){
							cleanPreviewVideo();
						}else{
							//hit test point preview movie
							if(activePlaylistHit){
								var t1 = parseInt(activePlaylistHit.offset().left,10) - parseInt(componentPlaylist.offset().left,10),
									t2 = parseInt(activePlaylistHit.offset().top,10)- parseInt(componentPlaylist.offset().top,10),
									d1 = e.pageX - parseInt(componentPlaylist.offset().left,10),
									d2 = e.pageY - parseInt(componentPlaylist.offset().top,10);
		
								if(d1 > t1 && d1 < t1 + boxWidth - boxMarginRight && d2 > t2 && d2 < t2 + boxHeight - boxMarginBottom){
									//console.log('isnt rollout, over flash preview');
									return false;
								}else{
									cleanPreviewVideo();
								}
							}else{
								cleanPreviewVideo();
							}
						}
					}
				} 
			} 
			else if(mediaPreviewType == 'youtube_single' || mediaPreviewType == 'youtube_playlist'){

				//hit test point preview movie
				if(activePlaylistHit && activePlaylistHit.offset()){
					var t1 = parseInt(activePlaylistHit.offset().left,10) - parseInt(componentPlaylist.offset().left,10),
						t2 = parseInt(activePlaylistHit.offset().top,10)- parseInt(componentPlaylist.offset().top,10),
						d1 = e.pageX - parseInt(componentPlaylist.offset().left,10),
						d2 = e.pageY - parseInt(componentPlaylist.offset().top,10);

					if(d1 > t1 && d1 < t1 + boxWidth - boxMarginRight && d2 > t2 && d2 < t2 + boxHeight - boxMarginBottom){
						
						//console.log(e.pageX, parseInt(componentPlaylist.offset().left,10) + playlistHolder.width());
						//console.log(e.pageY, parseInt(componentPlaylist.offset().top,10) + playlistHolder.height());
						
						if(playlistType!='wall'){
							//check playlist boundaries
							if(e.pageX <= parseInt(componentPlaylist.offset().left,10) ||
							   e.pageY <= parseInt(componentPlaylist.offset().top,10) ||
							   e.pageX >= parseInt(componentPlaylist.offset().left,10) + playlistHolder.width() ||
							   e.pageY >= parseInt(componentPlaylist.offset().top,10) + playlistHolder.height()){
								cleanPreviewVideo();
							}else{
								//console.log('isnt rollout, over yt preview');
								return false;
							}
						}else{
							//console.log('isnt rollout, over yt preview');
							return false;
						}
					}else{
						cleanPreviewVideo();
					}
				}else{
					cleanPreviewVideo();
				}
			}
		}
		
		if(playlistType!='wall'){
			currentTarget.removeClass('playlistSelected').addClass('playlistNonSelected');
		}
		currentPreviewID=-1;//reset
		//console.log('outPlaylistItem');
		return false;
	}
	
	//**************** END PREVIEW VIDEO
	
	function clickPlaylistItem(e){
		if(!_componentInited || _playlistTransitionOn) return false;
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		var currentTarget = $(e.currentTarget);
		var id = currentTarget.attr('data-id');
		currentPreviewID = id;//prevent double rollover
		//console.log('clickPlaylistItem');
		
		if(playlistType!='wall'){
		
			if(id == _playlistManager.getCounter()){//active item
				return false;
			} 
			
			if(useLivePreview) cleanPreviewVideo();
			
			_enableActiveItem();
			_playlistManager.processPlaylistRequest(id);
			
		}
		itemTriggered(id);
		
		return false;
	}
	
	function clickPlaylistItem2(){//called from flash preview click 
		//console.log('clickPlaylistItem2');
		if(!_componentInited || _playlistTransitionOn) return false;
		var id = activePlaylistID;
		
		if(playlistType!='wall'){
			
			if(id == _playlistManager.getCounter()){//active item
				return false;
			} 
			
			if(useLivePreview) cleanPreviewVideo();
			
			_enableActiveItem();
			_playlistManager.processPlaylistRequest(id);
			
		}
		itemTriggered(id);
	}
	
	function _enableActiveItem(){
		//console.log('_enableActiveItem');
		if(playlistType=='wall')return false;
		if(_playlistManager.getCounter()!=-1){
			var i = _playlistManager.getCounter(),_item = $(playlistArr[i]);
			if(_item)_item.removeClass('playlistSelected').addClass('playlistNonSelected');
			if(playlistType=='list'){
				var hitdiv = thumbHitDivArr[i];
				if(hitdiv) hitdiv.css('cursor', 'pointer');
			}
		}
	}
	
	function _disableActiveItem(){
		//console.log('_disableActiveItem');
		if(playlistType=='wall')return false;
		var i = _playlistManager.getCounter(),_item = $(playlistArr[i]);
		if(_item)_item.removeClass('playlistNonSelected').addClass('playlistSelected');
		if(playlistType=='list'){
			var hitdiv = thumbHitDivArr[i];
			if(hitdiv) hitdiv.css('cursor', 'default');
		}
	}
	
	function clickControls(e){
		if(!_componentInited || _playlistTransitionOn) return false;
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget),c=currentTarget.attr('class');
		
		if(c=='player_toggleControl'){
			togglePlayBack();
		}else if(c=='player_volume'){
			if(!isMobile){
				toggleVolume();
				setVolume();
			}else{
				if(volume_seekbar_autoHide){
					toggleVolumeMobile();//if volume seekbar autohides, then on mobile we cant use player volume btn for mute/unmute volume, we need to use it to open volume seekbar on which we can then adjust volume (and set mute if necessary)
				}else{
					toggleVolume();
					setVolume();
				}	
			}
		}else if(c=='playlist_toggle'){
			if(playlistType=='list'){
				togglePlaylist();
				playlistFsState = playlistOpened;	
			}
		}else if(c=='info_toggle'){
			toggleInfo();
		}else if(c=='ap_share_btn'){
			ap_share_holder.toggle();
		}else if(c=='player_fullscreen'){
			toggleFullscreen(true);
		}else if(c=='player_prev'){
			previousMedia();
		}else if(c=='player_next'){
			nextMedia();
		}else if(c=='caption_btn'){
			toggleCaptionMenu();
		}
		return false;
	}
	
	function overControls(e){
		if(!_componentInited || _playlistTransitionOn) return false;
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget),c=currentTarget.attr('class'),i=currentTarget.find('i');
		
		if(c=='player_toggleControl'){
			if(mediaPlaying){
				i.removeClass('ap_pause').addClass('ap_pause_on');
			}else{
				i.removeClass('ap_play').addClass('ap_play_on');
			}
		}else if(c=='player_volume'){	
			if(defaultVolume==0){
				i.removeClass('ap_mute').addClass('ap_mute_on');
			}else{
				i.removeClass('ap_vol').addClass('ap_vol_on');
			}
		}else if(c=='playlist_toggle'){
			i.removeClass('ap_pl_tog').addClass('ap_pl_tog_on');
		}else if(c=='info_toggle'){
			i.removeClass('ap_pl_info').addClass('ap_pl_info_on');
		}else if(c=='ap_share_btn'){
			i.removeClass('ap_pl_share').addClass('ap_pl_share_on');
		}else if(c=='player_fullscreen'){
			if(componentSize== "normal"){
				i.removeClass('ap_fs_ent').addClass('ap_fs_ent_on');
			}else{
				i.removeClass('ap_fs_exit').addClass('ap_fs_exit_on');
			}
		}else if(c=='caption_btn'){
			i.removeClass('ap_cc').addClass('ap_cc_on');
		}
		return false;
	}
	
	function outControls(e){
		if(!_componentInited || _playlistTransitionOn) return false;
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		
		var currentTarget = $(e.currentTarget),c=currentTarget.attr('class'),i=currentTarget.find('i');
		
		if(c=='player_toggleControl'){
			if(mediaPlaying){
				i.removeClass('ap_pause_on').addClass('ap_pause');
			}else{
				i.removeClass('ap_play_on').addClass('ap_play');
			}
		}else if(c=='player_volume'){	
			if(defaultVolume==0){
				i.removeClass('ap_mute_on').addClass('ap_mute');
			}else{
				i.removeClass('ap_vol_on').addClass('ap_vol');
			}
		}else if(c=='playlist_toggle'){
			i.removeClass('ap_pl_tog_on').addClass('ap_pl_tog');
		}else if(c=='info_toggle'){
			i.removeClass('ap_pl_info_on').addClass('ap_pl_info');
		}else if(c=='ap_share_btn'){
			i.removeClass('ap_pl_share_on').addClass('ap_pl_share');
		}else if(c=='player_fullscreen'){
			if(componentSize== "normal"){
				i.removeClass('ap_fs_ent_on').addClass('ap_fs_ent');
			}else{
				i.removeClass('ap_fs_exit_on').addClass('ap_fs_exit');
			}
		}else if(c=='caption_btn'){
			i.removeClass('ap_cc_on').addClass('ap_cc');
			if(!isMobile && captionMenuOpened){
				if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
				captionMenuTimeoutID = setTimeout(closeCaptionMenu, captionMenuTimeout);	
			}
		}
		return false;
	}
	
	//*******************
	
	function nextMedia(){
		if(!_componentInited) return;
		_enableActiveItem();
		_playlistManager.advanceHandler(1, true);
	}
	
	function previousMedia(){
		if(!_componentInited) return;
		_enableActiveItem();
		_playlistManager.advanceHandler(-1, true);
	}	
	
	function destroyMedia(){
		//console.log('destroyMedia');
		if(!_componentInited || !mediaType) return;
		if(mediaType)cleanMedia();
		_enableActiveItem();
		_playlistManager.reSetCounter();
	}
		
	function _findMedia(){
		//console.log('_findMedia');
		
		if(mediaType)cleanMedia();
		
		var data=$(playlistArr[_playlistManager.getCounter()]);
		mediaType = data.attr('data-type');
		ytMediaPath = data.attr('data-mp4Path');
		flashMediaPath= data.attr('data-mp4Path');
		
		if(useCaptions && data.find("div[class=track_list]").length){
			captionsExist=true;
		}
		
		if(mediaType == 'local'){
			if(autoPlay){
				if(html5Support){
					initVideo();
				}else{
					if(typeof getFlashMovie(flashMain) !== "undefined"){
						getFlashMovie(flashMain).pb_play(flashMediaPath, aspectRatio, componentWrapper.width(), componentWrapper.height(), 'local', true);
						videoInited=true;
					}
				}
			}else{
				loadPreview();
				showControls();
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(html5Support){
				_initYoutube();
			}else{
				if(typeof getFlashMovie(flashMain) !== "undefined"){
					getFlashMovie(flashMain).pb_play(ytMediaPath, aspectRatio, componentWrapper.width(), componentWrapper.height(), 'youtube', yt_autoPlay);
					if(autoPlay)videoInited=true;
				}
			}
		}
		if(playlistType!='wall' && !isMobile)itemTriggered(_playlistManager.getCounter());
	}
		
	function cleanMedia(){
		//console.log('cleanMedia');
		if(dataIntervalID) clearInterval(dataIntervalID);
		
		hideControls();
		hideInfo();
			
		if(mediaType && mediaType == 'local'){
			if(html5Support){
				if(videoUp2Js){
					videoUp2Js.pause();
					try{
						videoUp2Js.currentTime = 0;
					}catch(er){}
					videoUp2Js.src = '';
				}
				//video.find('source').attr('src','');
				if(video)video.unbind("ended", videoEndHandler).unbind("loadedmetadata", videoMetadata).unbind("waiting",waitingHandler).unbind("playing", playingHandler).unbind("play", playHandler).unbind("pause", pauseHandler);
				//video.unbind("canplaythrough", canplaythroughHandler).unbind("canplay", canplayHandler).unbind("volumechange", volumechangeHandler).unbind("timeupdate", dataUpdate);
				mediaHolder.css('display', 'none');
				if(!isMobile & html5Support){
					mediaHolder.html('');
					html5video_inited=false;	
				}else{
					if(useCaptions && video)video.removeAttr('id').removeClass('captioned');
				}
			}else{
				if((typeof getFlashMovie(flashMain) !== "undefined") && (getFlashMovie(flashMain).pb_dispose))getFlashMovie(flashMain).pb_dispose();
			}
		}else if(mediaType && mediaType == 'youtube_single' || mediaType && mediaType == 'youtube_playlist'){
			if(html5Support){
				if(_youtubePlayer) _youtubePlayer.stop();
				youtubeIframeMain.css('left', -10000+'px');
			}else{
				if((typeof getFlashMovie(flashMain) !== "undefined") && (getFlashMovie(flashMain).pb_dispose))getFlashMovie(flashMain).pb_dispose();
			}
		}	
		
		if(big_play.length) toggleBigPlay('off');
		if(previewPoster){
			previewPoster.remove();
			previewPoster=null;
		} 
		mediaPreview.css('display', 'none');
		resetData();
		mediaPlaying=false;
		videoInited=false;//reset
		if(useCaptions){
			//clean captions
			captionator.destroy();
			if(captions_menu)captions_menu.remove();
			player_captions.css('display','none');
		}
		resizeControls();
		captionsExist=false;
		mediaWidth=mediaHeight=null;
	}
	
	function toggleBigPlay(dir) {
		big_play.css('left', 0+'px');
		if(dir=='off'){
			big_play.css('opacity', 0); 	
			if(isIE && ieBelow9)big_play.css('display', 'none'); 	
		}else{
			big_play.css('opacity', 1); 	
			big_play.css('display', 'block'); 
		}
	}
	
	//***************** YOUTUBE
	
	function _initYoutube() {
		//console.log('_initYoutube');
		if(!_youtubeInited){
			var data={'autoPlay': yt_autoPlay, 'defaultVolume': defaultVolume, 
			'mediaPath': ytMediaPath, 'youtubeHolder': youtubeIframeMain, 'youtubeChromeless': _youtubeChromeless, 
			'isMobile': isMobile, 'initialAutoplay': initialAutoplay, 'quality':useYoutubeHighestQuality};
			_youtubePlayer = $.youtubePlayer(data);
			$(_youtubePlayer).bind('ap_YoutubePlayer.YT_READY', function(){
				//console.log('ap_YoutubePlayer.YT_READY');
				resizeVideo();
				big_play.css('left', -10000+'px');//hide big play first time because we need to start yt playback by clicking on yt player first time!!
			});
			$(_youtubePlayer).bind('ap_YoutubePlayer.START_PLAY', function(){
				//console.log('ap_YoutubePlayer.START_PLAY');
				videoInited=true;
				
				resizeVideo();
				checkInfo();
				showControls();
				if(dataIntervalID) clearInterval(dataIntervalID);
				dataIntervalID = setInterval(dataUpdate, dataInterval);	
				
				toggleBigPlay('on');
			});
			$(_youtubePlayer).bind('ap_YoutubePlayer.END_PLAY', function(){
				//console.log('ap_YoutubePlayer.END_PLAY');
				videoEndHandler();	
			});
			$(_youtubePlayer).bind('ap_YoutubePlayer.STATE_PLAYING', function(){
				//console.log('ap_YoutubePlayer.STATE_PLAYING');
				playHandler();
			});
			$(_youtubePlayer).bind('ap_YoutubePlayer.STATE_PAUSED', function(){
				//console.log('ap_YoutubePlayer.STATE_PAUSED');
				pauseHandler();
			});
			$(_youtubePlayer).bind('ap_YoutubePlayer.STATE_CUED', function(){//cue doesnt fire always
				//console.log('ap_YoutubePlayer.STATE_CUED');
				if(preloader.length)preloader.css('display','none');
			});
			_youtubeInited=true;
		}else{
			resizeVideo();
			_youtubePlayer.initVideo(ytMediaPath);
		}
		if(preloader.length)setTimeout(function(){preloader.css('display','none')},1000);
		showControls();
	}
	
	function _initYoutubePreview() {

		//ie9+ and html5 support fix, for other browser swe dont use api
		if(isIE){
	
			if(_youtubePreviewPlayer){
				$(_youtubePreviewPlayer).unbind('ap_YoutubePlayer.YT_READY').unbind('ap_YoutubePlayer.START_PLAY').unbind('ap_YoutubePlayer.END_PLAY');
				_youtubePreviewPlayer = null;
			}
				
			//if(!_youtubePreviewInited){
				var data={'autoPlay': true, 'defaultVolume': 0, 
				'mediaPath': ytMediaPath, 'youtubeHolder': youtubeIframePreview, 'youtubeChromeless': true, 
				'isMobile': isMobile, 'initialAutoplay': initialAutoplay, 'quality':'small', 'small_embed':true, 'isIE': isIE};
				_youtubePreviewPlayer = $.youtubePlayer(data);
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.YT_READY', function(){
					//console.log('ap_YoutubePlayer.YT_READY_PREVIEW');
				});
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.START_PLAY', function(){
					//console.log('ap_YoutubePlayer.START_PLAY_PREVIEW');
					//hide preloader
					if(activePlaylistPreloader) activePlaylistPreloader.css('display','none');
					if(currentPreviewID==-1){//if video call already requested but not yet started playing
						_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
						cleanPreviewVideo();
						return;
					}
					youtubeIframePreview.css({
						width:thumbWidth+'px',
						height:thumbHeight+'px',
						left:0+'px'
					});
					if(playlistType!='wall'){//for wall layout we add timer immediatelly (in overPlaylistItem) after yt_overlay_blocker is created so click on prettyphoto is accessible before yt movie starts
						if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
						scrollCheckIntervalID = setInterval(adjustPreviewVideo, scrollCheckInterval);
					}else{
						wallLayoutInited=true;	
					}
					setTimeout(function(){youtubeIframePreview.css('opacity',1)},100);//safari fix
				});
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.END_PLAY', function(){
					//console.log('ap_YoutubePlayer.END_PLAY_PREVIEW');
					if(currentPreviewID==-1){
						_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
						cleanPreviewVideo();
						return;
					}
					//rewind
					//_youtubePreviewPlayer.seek(0);
					_youtubePreviewPlayer.play();
				});
				_youtubePreviewInited=true;
			/*}else{
				_youtubePreviewPlayer.initVideo(ytMediaPath);
			}*/
		}else{
			
			if(!_youtubePreviewInited){
				var data={'autoPlay': true, 'defaultVolume': 0, 
				'mediaPath': ytMediaPath, 'youtubeHolder': youtubeIframePreview, 'youtubeChromeless': true, 
				'isMobile': isMobile, 'initialAutoplay': initialAutoplay, 'quality':'small', 'small_embed':true, 'isIE': isIE};
				_youtubePreviewPlayer = $.youtubePlayer(data);
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.YT_READY', function(){
					//console.log('ap_YoutubePlayer.YT_READY_PREVIEW');
				});
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.START_PLAY', function(){
					//console.log('ap_YoutubePlayer.START_PLAY_PREVIEW');
					//hide preloader
					if(activePlaylistPreloader) activePlaylistPreloader.css('display','none');
					if(currentPreviewID==-1){//if video call already requested but not yet started playing
						_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
						cleanPreviewVideo();
						return;
					}
					if(playlistType!='wall'){//for wall layout we add timer immediatelly (in overPlaylistItem) after yt_overlay_blocker is created so click on prettyphoto is accessible before yt movie starts
						if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
						scrollCheckIntervalID = setInterval(adjustPreviewVideo, scrollCheckInterval);
					}else{
						wallLayoutInited=true;	
					}
					setTimeout(function(){youtubeIframePreview.css('opacity',1)},100);//safari fix
				});
				$(_youtubePreviewPlayer).bind('ap_YoutubePlayer.END_PLAY', function(){
					//console.log('ap_YoutubePlayer.END_PLAY_PREVIEW');
					if(currentPreviewID==-1){
						_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
						cleanPreviewVideo();
						return;
					}
					//rewind
					//_youtubePreviewPlayer.seek(0);
					_youtubePreviewPlayer.play();
				});
				_youtubePreviewInited=true;
			}else{
				_youtubePreviewPlayer.initVideo(ytMediaPath);
			}
		}
	}
	
	//***************** LOCAL VIDEO
	
	function loadPreview(){
		//console.log('loadPreview');
		
		mediaPreview.css('display', 'block');
		if(preloader.length) preloader.css('display','block');

		var data=$(playlistArr[_playlistManager.getCounter()]), path = data.attr('data-imagePath'), url = path+"?rand=" + (Math.random() * 99999999);
		//console.log(url);
		
		previewPoster = $(new Image()).css({
		   position: 'absolute',
		   display: 'block',
		   opacity: 0
		}).appendTo(mediaPreview)
		.load(function() {
			if(preloader.length) preloader.css('display','none');
			previewOrigW=this.width;
			previewOrigH=this.height;
			mediaWidth=this.width;
			mediaHeight=this.height;
			resizePreview(previewPoster);
			previewPoster.animate({'opacity': 1},  {duration: 500, easing: "easeOutSine"});
			if(big_play.length) toggleBigPlay('on');
		}).error(function(e) {
			//console.log("error " + e);
		}).attr('src', url);
	}
	
	function initVideo(){
		//console.log('initVideo');
		var data=$(playlistArr[_playlistManager.getCounter()]), use_ogv=false;
		
		if(mp4Support){
			mediaPath=data.attr('data-mp4Path');
		}else{
			if(!useWebmVideoFormat && vorbisSupport && data.attr('data-ogvPath') != undefined){
				mediaPath=data.attr('data-ogvPath');
				use_ogv=true;
			}else if(useWebmVideoFormat && webmSupport  && data.attr('data-webmPath') != undefined){
				mediaPath=data.attr('data-webmPath');
			}else{
				alert('No supported video format found. Quitting.');	
				return false;
			}
		} 

		if(!html5video_inited){//we need one video source if we want to auto-advance on ios6 (with no click)
		
			var videoCode='';
			videoCode += '<video class="video_cont" width="'+mediaWidth+'" height="'+mediaHeight+'">';
			videoCode += '<source src="'+mediaPath+'" />';
			videoCode += '</video>';
			
			if(!isAndroid){//no type on android
				var append;
				if(mp4Support){
					append = 'type="video/mp4"';
				}else if(use_ogv){
					append = 'type="video/ogg"';
				}else{
					append = 'type="video/webm"';
				}
				var m = videoCode.match(/\/\>/);//closing source tag
				videoCode = videoCode.slice(0, m.index) + append + videoCode.slice(m.index);
			}
			//console.log(videoCode);
			
			if(captionsExist){
				var m = videoCode.match(/\<\/video\>/);//closing video tag
				videoCode = videoCode.slice(0, m.index) + createCaptions(data) + videoCode.slice(m.index);
			}
			
			mediaHolder.css('display','block').html(videoCode);
			
			video = mediaHolder.find('.video_cont');//get player reference
			videoUp2Js = video[0];
			//console.log(video, videoUp2Js);
			
		}else{
			
			mediaHolder.css('display','block');
			
			if(captionsExist){
				video.append($.parseHTML(createCaptions(data)));
			}
			
			videoUp2Js.src = mediaPath;
			videoUp2Js.load();
			
		}

		videoUp2Js.volume = defaultVolume;
		video.css('position','absolute').bind("ended", videoEndHandler).bind("loadedmetadata", videoMetadata).bind("waiting",waitingHandler).bind("playing", playingHandler).bind("play", playHandler).bind("pause", pauseHandler);
		//video.bind("canplaythrough", canplaythroughHandler).bind("canplay", canplayHandler).bind("volumechange", volumechangeHandler).bind("timeupdate", dataUpdate);
			
		if(isIOS && !html5video_inited){
			videoUp2Js.src = mediaPath;
			videoUp2Js.load();
		}
		else if(isAndroid && !html5video_inited){
			videoUp2Js.play();
			
			if(big_play.length) toggleBigPlay('off');
			if(previewPoster){
				previewPoster.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete:function(){
					previewPoster.remove();
					previewPoster=null;
				}});
			}
			videoInited=true;
			showControls();
		}
		
		html5video_inited=true;
		
		if(useCaptions && captionsExist){
			mediaPreview.css('display', 'block');//show because captions are inside!
			var h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
			captionator.captionify('.video_cont',null,{
				controlHeight:captionsBottomPadding+'px',
				appendCueCanvasTo:'.mediaPreview'
			},h);
			captionator.setRedraw(true);
		}
	}
	
	function waitingHandler(e){//show preloader
		//console.log('waitingHandler');
		if(preloader.length) preloader.css('display','block');
	}
	
	function playingHandler(e){//hide preloader
		//console.log('playingHandler');
		if(preloader.length) preloader.css('display','none');
	}
	
	function playHandler(e){
		//console.log('playHandler');
		player_toggleControl.find('i').removeClass('fa-play ap_play ap_play_on').addClass('fa-pause ap_pause');
		if(big_play.length) toggleBigPlay('off');
		mediaPlaying=true;
	}
	
	function pauseHandler(e){
		//console.log('pauseHandler');
		player_toggleControl.find('i').removeClass('fa-pause ap_pause ap_pause_on').addClass('fa-play ap_play');
		if(big_play.length) toggleBigPlay('on');
		mediaPlaying=false;
	}
	
	function videoMetadata(e){
		//console.log("videoMetadata: ", videoUp2Js.duration, videoUp2Js.videoWidth, videoUp2Js.videoHeight);
		if(videoUp2Js.videoWidth)mediaWidth=videoUp2Js.videoWidth;
		if(videoUp2Js.videoHeight)mediaHeight=videoUp2Js.videoHeight;
		resizeVideo();
		if(dataIntervalID) clearInterval(dataIntervalID);
		dataIntervalID = setInterval(dataUpdate, dataInterval);
		
		videoUp2Js.play();
		videoInited=true;
		
		checkInfo();
		autoPlay=true;
		showControls();
		
		if(captionsExist){
			mediaHolder.find('track').remove();//remove original tracks!
			var caption_tracks = videoUp2Js.textTracksNew;
			//console.log(caption_tracks);
			player_captions.css('display','block');
			resizeControls();
		}
	}
	
	function togglePlayBack(){
		//console.log('togglePlayBack');
		if(_playlistManager.getCounter() == -1) return false;
		if(mediaType == 'local'){
			 if(!videoInited && !autoPlay){
				if(previewPoster) {
					previewPoster.stop().animate({ 'opacity':0},  {duration: 500, easing: 'easeOutSine', complete:function(){
						previewPoster.remove();
						previewPoster=null;
					}});
				}
				if(html5Support){
					initVideo();
				}else{
					if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_play(flashMediaPath, aspectRatio, componentWrapper.width(), componentWrapper.height(), 'local', true);
				}
			 }else{
				if(html5Support){
				    if (videoUp2Js.paused) {
					    videoUp2Js.play();
				    } else {
					    videoUp2Js.pause();
				    }
				}else{
					if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_togglePlayback();
				}
			 }
		 }else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			  if(html5Support){
				  if(_youtubePlayer){
					  _youtubePlayer.togglePlayback();
				  } 
				  /*if(!isOpera){
					  if(_youtubePlayer){
						  _youtubePlayer.togglePlayback();
					  } 
				  }else{//opera fix
					if(mediaPlaying){
						_youtubePlayer.pause();
						pauseHandler();
					}else{
						_youtubePlayer.play();
						playHandler();
					}  
				  }*/
			  }else{
				  if(typeof getFlashMovie(flashMain) !== "undefined")getFlashMovie(flashMain).pb_togglePlayback();	
				  videoInited=true;
			  }
	   	 }
		 videoInited=true;
		 return false;
	}
	
	function dataUpdate(){
		if(mediaType == 'local'){
			if(html5Support){
				player_mediaTime_current.find('p').html(formatCurrentTime(videoUp2Js.currentTime));
				player_mediaTime_total.find('p').html(formatDuration(videoUp2Js.duration));
				if(!seekBarDown){
					progress_level.width((videoUp2Js.currentTime / videoUp2Js.duration) * seekBarSize);
					try{
						var buffered = Math.floor(videoUp2Js.buffered.end(0));
					}catch(error){}
					if(!isNaN(buffered)){
						var percent = buffered / Math.floor(videoUp2Js.duration);
						//console.log(percent, buffered);
						if(!isNaN(percent)){
							load_level.width(percent * seekBarSize);	
						}
					}
				}
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(html5Support){
				player_mediaTime_current.find('p').html(formatCurrentTime(_youtubePlayer.getCurrentTime()));
				player_mediaTime_total.find('p').html(formatDuration(_youtubePlayer.getDuration()));
				if(_youtubePlayer && !seekBarDown){
					progress_level.width((_youtubePlayer.getCurrentTime() / _youtubePlayer.getDuration()) * seekBarSize);
					percent = _youtubePlayer.getVideoBytesLoaded() / _youtubePlayer.getVideoBytesTotal();
					load_level.width(percent * seekBarSize);
				}
			}
		}	
	};
	
	function videoEndHandler(){//only for html5 support
		//console.log('videoEndHandler');
		if(autoAdvanceToNextVideo){
			nextMedia();
		}else{
			if(mediaType == 'local'){
				try{
					videoUp2Js.currentTime=0;
				}catch(er){}
				if(videoUp2Js.paused)videoUp2Js.play();
				if(!autoPlay){
					videoUp2Js.pause();
				}
			}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
				//_youtubePlayer.seek(0);
				if(autoPlay){
					_youtubePlayer.play();
				}else{
					if(big_play.length) toggleBigPlay('off');//hide play btn for yt (it gets called from pause handles yt which fires on end as well) because it already has its own btn on beginning
				}
			}
		}
	}
	
	//********** caption related
	
	function toggleCaptionMenu(){
		if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
		
		if(!captionMenuOpened){
			caption_holder.css({display: 'block'}).stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine", complete: function(){
			}});
		}else{
			caption_holder.stop().animate({'opacity': 0},  {duration: 500, easing: "easeOutSine", complete: function(){
				caption_holder.css('display','none');
			}});
		}
		captionMenuOpened=!captionMenuOpened;
	}
	
	function openCaptionMenu(){
		if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
		caption_holder.css({display: 'block'}).stop().animate({'opacity': 1},  {duration: 500, easing: "easeOutSine", complete: function(){
		}});
		captionMenuOpened=true;
	}
	
	function closeCaptionMenu(){
		if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
		caption_holder.stop().animate({'opacity': 0},  {duration: 500, easing: "easeOutSine", complete: function(){
			caption_holder.css('display','none');
		}});
		captionMenuOpened=false;
	}
	
	function createCaptions(data){
		var append='', str, div = $('<div>'), li, a, _item, default_exist=false;
	
		//create caption menu list
		captions_menu = $("<ul class='captions_menu'></ul>").appendTo(caption_holder);
		//console.log(data);
		
		data.find("div[class=track_list]").children().each(function(){
			_item=$(this);
			//console.log(_item);
			
			li = $('<li/>').appendTo(captions_menu);
			a = $('<a href="#"/>').text( _item.attr('data-label')).addClass('captionOut').attr('data-srclang',_item.attr('data-srclang')).bind('click', captionToggle).appendTo(li);
			if(!isMobile)a.bind('mouseover', overCaption).bind('mouseout', outCaption);
			
			if (_item.attr("data-default")){
				default_exist=true;
				active_caption_item=a.removeClass('captionOut').addClass('captionOver').data('active', true).css('cursor', 'default');
			}
			
			str = div.empty().append(_item.clone()).html();
			str = str.replace(/\<div/g, "<track").replace(/\<\/div\>/g, "</track>").replace(/data\-/g, "");
			//console.log(str);
			append += str;		
			
		});
		
		li = $('<li/>').appendTo(captions_menu);
		a = $('<a href="#"/>').text('None').addClass('captionOut').attr('data-srclang','none').bind('click', captionToggle).appendTo(li);
		if(!default_exist)active_caption_item=a.removeClass('captionOut').addClass('captionOver').data('active', true).css('cursor', 'default');
		if(!isMobile)a.bind('mouseover', overCaption).bind('mouseout', outCaption);
		
		caption_holder.css('top', - caption_holder.height()-5+'px');
		//console.log(caption_holder.width(), caption_holder.height());
		
		return append;
	}
	
	function captionToggle(){
		var _item = $(this);
		if(_item.data('active') == true)return false;//active item
		if(active_caption_item){
			active_caption_item.removeClass('captionOver').addClass('captionOut').data('active', false).css('cursor', 'pointer');
		}
		active_caption_item = _item.removeClass('captionOut').addClass('captionOver').data('active', true).css('cursor', 'default');
		
		var caption_tracks = videoUp2Js.textTracksNew, lang = _item.attr('data-srclang'), i = 0, len = caption_tracks.length;
		//console.log(_item.attr('data-srclang'));
		//console.log(caption_tracks);
		if(lang == 'none'){
			for(i;i<len;i++){//hide all captions
				caption_tracks[i].mode = 0;
			}
		}else{
			for(i;i<len;i++){
				if(caption_tracks[i].language == lang){//disable active
					caption_tracks[i].mode = 2;
				}else{//hide others
					caption_tracks[i].mode = 0;
				}
			}
		}
		
		if(isMobile){
			if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
			captionMenuTimeoutID = setTimeout(closeCaptionMenu, captionMenuTimeout);	
		}
		
		return false;
	}
	
	function overCaption(){
		if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
		var _item = $(this);
		_item.removeClass('captionOut').addClass('captionOver');
		return false;
	}
	
	function outCaption(){
		if(captionMenuTimeoutID) clearTimeout(captionMenuTimeoutID);
		captionMenuTimeoutID = setTimeout(closeCaptionMenu, captionMenuTimeout);
		var _item = $(this);
		if(_item.data('active') != true)_item.removeClass('captionOver').addClass('captionOut');
		return false;
	}
	
	//********** flash

	this.flashPreviewVideoStart2 = function(){
		//console.log('flashPreviewVideoStart2');
		//hide preloader
		if(activePlaylistPreloader) activePlaylistPreloader.css('display','none');
	}
	this.flashPreviewVideoStart = function(){
		//console.log('flashPreviewVideoStart');
		if(scrollCheckIntervalID) clearInterval(scrollCheckIntervalID);
		scrollCheckIntervalID = setInterval(adjustPreviewVideo, scrollCheckInterval);
	}
	this.flashVideoPause = function(){
		pauseHandler();
	}
	this.flashVideoResume = function(){
		playHandler();
	}
	this.flashVideoEnd = function(){
		nextMedia();	
	}
	this.flashVideoStart = function(){
		videoInited=true;
		playHandler();
		showControls();
		checkInfo();
	}
	this.dataUpdateFlash = function(bl,bt,t,d){
		load_level.width((bl/bt) * seekBarSize);	
		progress_level.width((t/d) * seekBarSize);
		player_mediaTime_current.html(formatCurrentTime(t));
		player_mediaTime_total.html(formatDuration(d));
	}

	function checkFlashReady(){
		//console.log('checkFlashReady');
		if(getFlashMovie(flashMain).setData != undefined){
			if(flashReadyIntervalID) clearInterval(flashReadyIntervalID);
			
			getFlashMovie(flashMain).setData(settings);//pass data to flash
			
			if(useLivePreview && typeof getFlashMovie(flashPreview) !== "undefined"){
				$(flashPreview).css('display','block');
				flashReadyIntervalID = setInterval(checkFlashReady2, flashReadyInterval);
			}else{
				checkPlaylistProcess();
			}
		}
	}
	 
	function checkFlashReady2(){
		//console.log('checkFlashReady2');
		if(getFlashMovie(flashPreview).setData != undefined){
			if(flashReadyIntervalID) clearInterval(flashReadyIntervalID);
			getFlashMovie(flashPreview).setData(settings);//pass data to flash
			flashPreviewHolder.css({
				left:-10000+'px',
				width: thumbWidth+'px',
				height: thumbHeight+'px'
			});
			checkPlaylistProcess();
		}
	}
	
	function getFlashMovie(name) {
		if(name.charAt(0)=='#')name = name.substr(1);//remove'#'
		return (navigator.appName.indexOf("Microsoft") != -1) ? window[name] : document[name];
	}	
	
	//***************** description
	
	function checkInfo(){
		if(mainWrapper.find('.infoHolder').length==0) return;
		//console.log('checkInfo');
		var i = _playlistManager.getCounter();
		if(descriptionArr[i] != undefined && !isEmpty(descriptionArr[i])){
			var infoData = descriptionArr[i];
			//console.log(infoData);
			info_inner.html(infoData);
			
			info_toggle.css({opacity: 0, display: 'block'}).stop().animate({ 'opacity': 1},  {duration: 500, easing: 'easeOutSine'});
			if(autoOpenDescription){
				toggleInfo();
			}
		}
	}
	
	function hideInfo(){
		if(mainWrapper.find('.infoHolder').length==0) return;
		//console.log('hideInfo');
		infoHolder.css('display','none');
		info_toggle.stop().animate({ 'opacity': 0},  {duration: 500, easing: 'easeOutSine', complete: function(){
			info_toggle.css('display','none');
		}});
		infoOpened=false;
	}

	function toggleInfo(){
		if(mainWrapper.find('.infoHolder').length==0) return;
		//console.log('toggleInfo');
		if(!infoOpened){
			infoHolder.css({opacity:0, display:'block'});//show it for jscrollpane!
			
			if(!info_scrollPaneApi){
				info_scrollPaneApi = infoHolder.jScrollPane().data().jsp;
				infoHolder.bind('jsp-initialised',function(event, isScrollable){
					//console.log('Handle jsp-initialised', ' isScrollable=', isScrollable);
				});
				infoHolder.jScrollPane({
					verticalDragMinHeight: 100,
					verticalDragMaxHeight: 100
				});
			}else{
				info_scrollPaneApi.reinitialise();
				info_scrollPaneApi.scrollToY(0);
			}
			
			infoHolder.stop().animate({ 'opacity': 1},  {duration: 500, easing: 'easeOutSine'});
			infoOpened = true;
		}else{
			infoHolder.stop().animate({ 'opacity': 0},  {duration: 500, easing: 'easeOutSine', complete: function(){
				infoHolder.css('display','none');
			}});
			infoOpened=false;
		}
	}
	
	function resizeInfo(){
		if(info_scrollPaneApi){
			info_scrollPaneApi.reinitialise();
			info_scrollPaneApi.scrollToY(0);
		}
	}
	
	//***************
	
	function overComponent(e) {
		if(!_componentInited || _playlistTransitionOn) return false;
		//console.log('overComponent');
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		showControls();
		return false;
	}
	
	function outComponent(e) {
		if(!_componentInited || _playlistTransitionOn) return false;
		//console.log('outComponent');
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		if(autoHideControls && componentSize!= "fullscreen")hideControls();
		if(useLivePreview){
			if(_youtubePreviewPlayer)_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
			cleanPreviewVideo();
			if(playlistType=='list'){
				if(pp_currentPreviewID!=-1 && pp_currentPreviewID != _playlistManager.getCounter() && $(playlistArr[pp_currentPreviewID])){
					$(playlistArr[pp_currentPreviewID]).removeClass('playlistSelected').addClass('playlistNonSelected');
				}	
			}
		}
		return false;
	}
	
	function outPlaylist(e) {
		if(!_componentInited || _playlistTransitionOn) return false;
		//console.log('outPlaylist');
		if (!e) var e = window.event;
		if(e.cancelBubble) e.cancelBubble = true;
		else if (e.stopPropagation) e.stopPropagation();
		if(useLivePreview){
			if(_youtubePreviewPlayer)_youtubePreviewPlayer.stopPreview();//fix, youtube stop wont stop video if it hasnt started playing yet
			cleanPreviewVideo();
			if(playlistType=='list'){	
				if(pp_currentPreviewID!=-1 && pp_currentPreviewID != _playlistManager.getCounter() && $(playlistArr[pp_currentPreviewID])){
					$(playlistArr[pp_currentPreviewID]).removeClass('playlistSelected').addClass('playlistNonSelected');
				}	
			}
		}
		return false;
	}
	
	function showControls(){
		if(playlistType=='wall')return false;
		//console.log('showControls');
		player_addon.css('display','block');
		if(!videoInited) return false;
		playerControls.css('display','block');
		resizeControls();
	}
	
	function showControls2(){
		if(playlistType=='wall')return false;
		//console.log('showControls');
		player_addon.css('display','block');
		if(!videoInited) return false;
		playerControls.css('display','block');
	}
	
	function hideControls(){
		//console.log('hideControls');
		if(playlistType=='wall')return false;
		player_addon.css('display','none');
		playerControls.css('display','none');
	}
	
	//************* RESIZE
	
	if(playlistType!='wall'){
		_window.resize(function() {
			 if(!_componentInited || _playlistTransitionOn) return false;
			 _doneResizing();
		});
	}
	
	if(isMobile){
		_window.doubletap(function() { 
			setTimeout(function(){
				clearTimeout($(this));
				_doneResizing();
			 },1000);
		 });	
	}
	
	function _doneResizing(){
		//console.log('_doneResizing');
		
		checkPlaylist();
		
		if(componentSize== "fullscreen"){
			resizeComponent();	
		}else{
			if(mediaType == 'local'){
				if(!videoInited){
					resizePreview(previewPoster);
				}else{
					if(html5Support)resizeVideo();
				}
			}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
				resizeVideo();
			}
		}
		resizeControls();
		if(infoOpened)resizeInfo();
		
		if(useCaptions && captionsExist){
			var h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
			captionator.setHeight(h);
			
			captionator.setRedraw(false);
		}
	}
	
	function checkPlaylist(){
		
		if(!playlistHidden){
		
			if(playlistType=='list'){
				
				var w = mainWrapper.width() != 0 ? mainWrapper.width() : getDocumentWidth(), h = mainWrapper.height() != 0 ? mainWrapper.height() : getDocumentHeight(), wp = playerHolder.width(), wpl = playlistHolder.width();
				
				//console.log(w,h);
				
				if(playlistOrientation == 'vertical'){
					
					if(componentSize!= "fullscreen"){
						if(!isiPhoneIpod){ 
							if(w < wp + wpl){
								//console.log(1);
								playlistHolder.css({
									position:'absolute',
									left:wp - wpl+'px',
									height:h-playerControls.height()+'px'
								});
							}else{
								//console.log(2);
								playlistHolder.css({
									position:'absolute',
									left:wp+'px',
									height:h+'px'
								});
							}
						}else{//iphone, ipod fix!! //let playlist fall below video area in this case! important!!
							playlistHolder.css({
								position:'relative',
								left:0+'px',
								height:250+'px',
								'float':'right',
								clear:'both'
							});
						}
					}else{
						playlistHolder.css({
							position:'fixed',
							left:w - wpl+'px',
							height:h-playerControls.height()+'px'
						});
					}
				}
				
				if(playlistOrientation == 'horizontal'){
					if(componentSize== "fullscreen"){
						playlistHolder.css('width',w+'px');
					}else{
						playlistHolder.css('width',100+'%');
					}
				}
				
				_thumbInnerContainerSize=0;
				var i = 0, div;
				for(i;i<playlistLength;i++){
					div = $(playlistArr[i]);
					if(playlistOrientation == 'horizontal'){
						_thumbInnerContainerSize+=div.outerWidth(true);
					}else{
						_thumbInnerContainerSize+=div.outerHeight(true);
					}
				}
				
				if(scrollType == 'buttons'){
					if(playlistOrientation == 'horizontal'){
						thumbInnerContainer.css('left', 0+'px');
						playlist_inner.width(_thumbInnerContainerSize);
					}else{
						thumbInnerContainer.css('top', 0+'px');
					}
					_checkThumbPosition();
				}else if(scrollType == 'scroll'){
					if(playlistOrientation == 'horizontal'){
						lastPlaylist.width(_thumbInnerContainerSize);
					}
					checkScroll();
				}
			}
		}
	}
	
	function resizeComponent(){
		//console.log('resizeComponent');

		if(controlsTimeoutID) clearTimeout(controlsTimeoutID);
		_doc.unbind('mousemove',trackFsMouse);

		if(componentSize== "fullscreen"){
			_body.css('overflow', 'hidden');
			
			if(playlistType=='list'){
				playerHolder.removeClass('playerHolder').addClass('playerHolder_fs');
			}
			mainWrapper.find('.player_adv').removeClass('player_adv').addClass('player_adv_fs');
			
			if(isMobile){
				controlsTimeoutID = setTimeout(function() {clearTimeout(controlsTimeoutID);checkActivity();},controlsTimeout);
			}else{
				_doc.unbind('mousemove', trackFsMouse).bind('mousemove',trackFsMouse);
				controlsTimeoutID = setTimeout(function() {clearTimeout(controlsTimeoutID);trackFsMouse();},controlsTimeout);
			}
			
			if(closePlaylistOnFsEntry){
				togglePlaylist('off');
				playlistFsState = playlistOpened; 	
			}
			
			mainWrapper.find('.player_fullscreen').find('i').removeClass().addClass('fa fa-compress ap_fs_exit');//no fs support
			
		}else{
			
			_body.css('overflow', bodyOverflowOrig);//restore original overflow
			
			if(playlistType=='list'){
				playerHolder.removeClass('playerHolder_fs').addClass('playerHolder');
			}
			mainWrapper.find('.player_adv_fs').removeClass('player_adv_fs').addClass('player_adv');
			
			mainWrapper.find('.player_fullscreen').find('i').removeClass().addClass('fa fa-expand ap_fs_ent');//fix
		}
		
		if(previewPoster)resizePreview(previewPoster);
		if(html5Support)resizeVideo();
		if(infoOpened)resizeInfo();
		resizeControls();
		showControls();
		
		checkPlaylist();
		
		if(useCaptions && captionsExist){
			if(captionTimeoutID) clearTimeout(captionTimeoutID);
			captionTimeoutID = setTimeout(fixCaptionOutOfFs, captionTimeout);
		}
	}
	
	function fixCaptionOutOfFs(){
		if(captionTimeoutID) clearTimeout(captionTimeoutID);
		var h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
		captionator.setHeight(h);
	}
	
	//chrome fix, 
	//http://stackoverflow.com/questions/17818493/mousemove-event-repeating-every-second
	//http://stackoverflow.com/questions/4579071/jquery-mousemove-is-called-even-if-the-mouse-is-still
	function trackFsMouse(e){
		if(!videoInited) return false;
		//console.log('trackFsMouse');
		if(controlsTimeoutID)clearTimeout(controlsTimeoutID);
		if(e){
			if (prevX != e.clientX) {
				//show controls
				//console.log('mouse moved');
				showControls2();
				if(playlistFsState)togglePlaylist('on');//show playlist in fs only if its opened by default
			}
			prevX = e.clientX;
		}
		controlsTimeoutID = setTimeout(function(){
			//hide controls
			//console.log('mouse still');
			hideControls();
			playlistFsState = playlistOpened; 
			togglePlaylist('off');	
			
		},controlsTimeout);
	}
	
	if(isMobile){
		_doc.bind("touchend.ap2",function(e){
			if(componentSize== "fullscreen"){
				if(controlsTimeoutID) clearTimeout(controlsTimeoutID);
				showControls2();
				if(playlistFsState)togglePlaylist('on');
				controlsTimeoutID = setTimeout(function() {clearTimeout(controlsTimeoutID);checkActivity();},controlsTimeout);
			}
		});
	}
	
	function checkActivity(){
		if(controlsTimeoutID) clearTimeout(controlsTimeoutID);
		
		hideControls();
		playlistFsState = playlistOpened; 
		togglePlaylist('off');
		
		controlsTimeoutID = setTimeout(function() {clearTimeout(controlsTimeoutID);checkActivity();},controlsTimeout);
	}
	
	function checkActivity2(){
		if(controlsTimeoutID) clearTimeout(controlsTimeoutID);
		
		hideControls();
		playlistFsState = playlistOpened; 
		togglePlaylist('off');
	}

	function resizeControls(){
		//console.log('resizeControls');
		seekBarElementsSize = getSeekBarElementsSize();
		playerControlsSize = playerControls.width();
		seekBarSize = playerControlsSize - seekBarElementsSize - player_seekbar_offset;
		//console.log(playerControlsSize, seekBarSize, seekBarElementsSize);
		player_seekbar.width(seekBarSize + player_seekbar_offset-1);
		progress_bg.width(seekBarSize);
	}
	
	function getSeekBarElementsSize(){
		var a = player_mediaTime_current.css('display') == 'block' ? current_time_width : 0;
			b = player_mediaTime_total.css('display') == 'block' ? total_time_width : 0; 
			c = player_volume.css('display') == 'block' ? volume_width : 0; 
			d = player_fullscreen.css('display') == 'block' ? fullscreen_width : 0;
			e = player_captions.css('display') == 'block' ? player_captions_width : 0;
			if(fs_removed)d=0;
		return toggleControl_width + a + b + c + d + e;
	}
	
	function resizePreview(img) {
		if(!img) return false;
		//console.log('resizePreview');
		var o, x, y, w = getComponentSize('w') != 0 ? getComponentSize('w') : getDocumentWidth(), h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
		
		if(aspectRatio == 0) {//normal media dimensions
			o=getMediaSize();
		}else if(aspectRatio == 1) {//fitscreen
			o = retrieveObjectRatio(true, img,previewOrigW,previewOrigH);
		}else if(aspectRatio == 2) {//fullscreen
			o = retrieveObjectRatio(false, img,previewOrigW,previewOrigH);
		}
		x = parseInt(((w - o.width) / 2),10);
		y = parseInt(((h - o.height) / 2),10);
		img.css({
			width: o.width+ 'px',
			height: o.height+ 'px',
			left:x+'px',
			top:y+'px'
		});
	}
	
	function resizeVideo() {
		
		if(_playlistManager.getCounter()==-1) return false;
		//console.log('resizeVideo');
		var o, x, y, w = getComponentSize('w') != 0 ? getComponentSize('w') : getDocumentWidth(), h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
		
		if(aspectRatio == 0) {//normal media dimensions
			o=getMediaSize();
		}else if(aspectRatio == 1) {//fitscreen
			o = retrieveObjectRatio(true);
		}else if(aspectRatio == 2) {//fullscreen
			o = retrieveObjectRatio(false);
		}
		x = parseInt(((w - o.width) / 2),10);
		y = parseInt(((h - o.height) / 2),10);
		//console.log(o.width, o.height, w,h);
		if(mediaType == 'local'){
			if(video){
				video.css({
					width: o.width+ 'px',
					height: o.height+ 'px',
					left:x+'px',
					top:y+'px'
				});
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(youtubeIframeMain){
				youtubeIframeMain.css({
					width: o.width+ 'px',
					height: o.height+ 'px',
					left:x+'px',
					top:y+'px'
				});
			}
		}
	}
	
	 function retrieveObjectRatio( _fitScreen, obj, cw,ch) {
		//console.log('retrieveObjectRatio'); 
		var _paddingX=0,_paddingY=0;
	 
		var w = getComponentSize('w') != 0 ? getComponentSize('w') : getDocumentWidth(), h = getComponentSize('h') != 0 ? getComponentSize('h') : getDocumentHeight();
		
		var targetWidth, targetHeight, val={};
	 	if(!obj){
			var obj = getMediaSize();
			targetWidth = obj.width;
			targetHeight = obj.height;
		}else{
			if(typeof(cw) !== "undefined" && typeof(ch) !== "undefined"){
				targetWidth = cw;
				targetHeight = ch;
			}else{
				targetWidth = obj.width();
				targetHeight = obj.height();
			}
		}
		
		//console.log(w,', ',h);
		//console.log(targetWidth,', ',targetHeight);
		
		var destinationRatio = (w - _paddingX) / (h - _paddingY);
		var targetRatio = targetWidth / targetHeight;

		if (targetRatio < destinationRatio) {
			if (!_fitScreen) {//fullscreen
				val.height = ((w - _paddingX) /targetWidth) * targetHeight;
				val.width = (w - _paddingX);
			} else {//fitscreen
				val.width = ((h - _paddingY) / targetHeight) *targetWidth;
				val.height = (h - _paddingY);
			}
		} else if (targetRatio > destinationRatio) {
			if (_fitScreen) {//fitscreen
				val.height = ((w - _paddingX) /targetWidth) * targetHeight;
				val.width = (w - _paddingX);
			} else {//fullscreen
				val.width = ((h - _paddingY) / targetHeight) *targetWidth;
				val.height = (h - _paddingY);
			}
		} else {//fitscreen & fullscreen
			val.width = (w - _paddingX);
			val.height = (h - _paddingY);
		}
		return val;
	}
	
	function getMediaSize() {
		//console.log('getMediaSize');
		var o={}, default_w=640, default_h=360;
		//console.log(videoUp2Js.videoWidth, mediaWidth, videoUp2Js.videoHeight, mediaHeight);
		if(mediaType=='local'){
			if(!mediaWidth || isNaN(mediaWidth) || !mediaHeight || isNaN(mediaHeight)){
				if(videoUp2Js){
					o.width = videoUp2Js.videoWidth;
					o.height = videoUp2Js.videoHeight;
				}else{
					o.width = default_w;//default values (16:9)
					o.height = default_h;
				}
			}else{
				o.width=mediaWidth;
				o.height=mediaHeight;	
			}
		}else if(mediaType == 'youtube_single' || mediaType == 'youtube_playlist'){
			if(!mediaWidth || isNaN(mediaWidth) || !mediaHeight || isNaN(mediaHeight)){
				o.width = default_w;//default youtube values (16:9)
				o.height = default_h;
			}else{
				o.width=mediaWidth;
				o.height=mediaHeight;	
			}
		}
		return o;
	}
	
	function getComponentSize(type) {
		if(type == "w"){//width
			return componentSize == "normal" ? componentWrapper.width() : getDocumentWidth();
		}else{//height
			return componentSize == "normal" ? componentWrapper.height() : getDocumentHeight();
		}
	}
	
	function getDocumentWidth(){
		return Math.max(
			_window.width(),
			/* For opera: */
			document.documentElement.clientWidth
		);
	};	
	
	function getDocumentHeight(){
		return Math.max(
			_window.height(),
			/* For opera: */
			document.documentElement.clientHeight
		);
	};
	
	//**************** FULLSCREEN
	
	function setFullscreenIcon(){
		 //console.log('setFullscreenIcon');
		 if ((document.fullScreenElement && document.fullScreenElement !== null) ||   
			  (!document.mozFullScreen && !document.webkitIsFullScreen)) { 
			   mainWrapper.find('.player_fullscreen').find('i').removeClass().addClass('fa fa-expand ap_fs_ent');
		 }else{
			   mainWrapper.find('.player_fullscreen').find('i').removeClass().addClass('fa fa-compress ap_fs_exit');
		 }
	}
	
	function fullScreenStatus(){
		return document.fullscreen || document.mozFullScreen || document.webkitIsFullScreen;
	}
	
	if(playlistType!='wall'){
		if(fullscreenPossible){
			_doc.on("fullscreenchange mozfullscreenchange webkitfullscreenchange", function(){
				//console.log('fullScreenStatus()');
				setFullscreenIcon();
				if(componentSize== "fullscreen" && fullscreenCount>0){
					//console.log('fullscreenchange');
					componentSize="normal";
					resizeComponent();	
				}
				fullscreenCount=1;//firefox fix for escape key
				
				if(useCaptions && captionsExist)captionator.setRedraw(false);
			});
		}
	}
	
	function toggleFullscreen(btnInitiated){
		//console.log('toggleFullscreen');
		fullscreenCount=0;
		
		if(componentSize== "normal"){
			componentSize= "fullscreen";
		}else{
			componentSize="normal";
		}
		setFullscreenIcon();	
			
		//http://stackoverflow.com/questions/8427413/webkitrequestfullscreen-fails-when-passing-element-allow-keyboard-input-in-safar
		//https://github.com/martinaglv/jQuery-FullScreen/blob/master/fullscreen/jquery.fullscreen.js#L82
					
		if(fullscreenPossible || html5Support){
		  
			var elem = document.documentElement;
			if (elem.requestFullscreen) {
				//console.log("using W3C Fullscreen API");
				if (document.fullscreenElement) {
					document.exitFullscreen();
				} else {
					elem.requestFullscreen();
				}
			} else if (elem.webkitRequestFullScreen) {
				//console.log("using WebKit FullScreen  API");
				if (document.webkitIsFullScreen) {
					document.webkitCancelFullScreen();
				} else {
					elem.webkitRequestFullScreen();
				}
			} else if (elem.mozRequestFullScreen) {
				//console.log("using Mozilla FullScreen  API");
				if (document.fullscreenElement || document.webkitIsFullScreen || document.mozFullScreenElement) {
					document.mozCancelFullScreen();
				} else {
					elem.mozRequestFullScreen();
				}
			}else if(isIOS){
				//console.log('ios');
				try{
					//if(videoUp2Js && videoUp2Js.webkitEnterFullScreen != undefined)videoUp2Js.webkitEnterFullScreen();//we cant have captions in ios fullscreen!
				}catch(error){}
			}else {
				//console.log("no fullscreen API");
			}
		}
		
		if(!fullscreenPossible) {
			if(useCaptions && captionsExist)captionator.setRedraw(false);//if fs not supported
			resizeComponent();	
		}else if(componentSize=="normal" && btnInitiated){
			resizeComponent();		
		}
	}
	
	function checkFullScreenSupport() {
	    var support=false;
	    if (document.documentElement.requestFullscreen) {
		  support=true;
		} else if (document.documentElement.mozRequestFullScreen) {
		   support=true;
		} else if (document.documentElement.webkitRequestFullScreen) {
		   support=true;
		}
		if (!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement) { 
			if (document.documentElement.requestFullscreen) {
				support=true;
			} else if (document.documentElement.mozRequestFullScreen) {
				support=true;
			} else if (document.documentElement.webkitRequestFullscreen) {
				support=true;
			}
		}
		//console.log('support=',support);
		return support;
	}
	
	//**************** HELPER FUNCTIONS
	
	function isEmpty(str) {
	    return str.replace(/^\s+|\s+$/g, '').length == 0;
	}
	
	function resetData(){
	  player_mediaTime_current.find('p').html('00:00');
	  player_mediaTime_total.find('p').html('00:00');
	  progress_level.width(0);
	  load_level.width(0);
	}		
	
	function canPlayVorbis() {
		var v = document.createElement('video');
		return !!(v.canPlayType && v.canPlayType('video/ogg; codecs="theora, vorbis"').replace(/no/, ''));
	}
	
	function canPlayMP4() {
		var v = document.createElement('video');
		return !!(v.canPlayType && v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"').replace(/no/, ''));
	}
	
	function canPlayWebM() {
		var v = document.createElement('video');
		return !!(v.canPlayType && v.canPlayType('video/webm; codecs="vp8, vorbis"').replace(/no/, ''));
	}
	
	function formatCurrentTime(seconds) {
		seconds = Math.round(seconds);
		minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	}
	
	function formatDuration(seconds) {
		seconds = Math.round(seconds);
		minutes = Math.floor(seconds / 60);
		minutes = (minutes >= 10) ? minutes : "0" + minutes;
		seconds = Math.floor(seconds % 60);
		seconds = (seconds >= 10) ? seconds : "0" + seconds;
		return minutes + ":" + seconds;
	}
	
	// ******************************** PUBLIC FUNCTIONS **************** //
	this.getVolume = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		return defaultVolume;	
	}
	this.togglePlayback = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		if(!mediaType) return false;
		togglePlayBack();
	}
	this.nextMedia = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		nextMedia();
	}
	this.previousMedia = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		previousMedia();
	}
	this.setVolume = function(val){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		if(!videoInited) return false;
		if(val<0) val=0;
		else if(val>1) val=1;
		defaultVolume = val;
		setVolume();
	}
	this.destroyMedia = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		destroyMedia();
	}
	this.togglePlaylist = function(dir){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		togglePlaylist(dir);
	}
	this.toggleDescription = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType=='wall') return false;
		if(_playlistManager.getCounter()==-1) return false;
		toggleInfo();
	}
	this.loadMedia = function(value){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType!='wall'){
			if(useDeeplink){
				if(typeof(value) === 'string'){
					$.address.value(value);
				}else{
					alert('Invalid value loadMedia Deeplink!');
					return false;	
				}
			}else{
				if(typeof(value) === 'number'){
					if(value<0)value=0;
					else if(value>playlistLength-1)value=playlistLength-1;
					_enableActiveItem();
					_playlistManager.processPlaylistRequest(value);
				}else if(typeof(value) === 'string'){
					if(_activePlaylist==value)return false;//playlist already loaded!
					_activePlaylist=value;
					_setPlaylist();			
				}else{
					alert('Invalid value loadMedia no Deeplink!');
					return false;	
				}
			}
		
		}else{//in wall layout only possible to load new playlist, deeplink off by default
			if(typeof(value) === 'string'){
				if(_activePlaylist==value)return false;//playlist already loaded!
				_activePlaylist=value;
				_setPlaylist();			
			}else{
				alert('Invalid value loadMedia Wall Layout!');
				return false;	
			}
		}
	}
	this.loadTrack = function(data){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(playlistType!='wall'){
			
			if(data.thumb){
				
			}else{
				//just play video, no visible playlist
				
			}
		
			
		}else{
			alert('loadTrack method is not available for wall layout! Quitting.');
			return false;	
		}
	}
	this.cleanPreviewVideo = function(){
		if(!_componentInited || _playlistTransitionOn) return false;
		if(!useLivePreview) return false;
		cleanPreviewVideo();
	}
	
	this.outputPlaylistData = function(){
		if(!_componentInited) return false;
		if(_playlistTransitionOn) return false;
		if(!lastPlaylist) return false;
		try{ 
			console.log(deeplinkData);	
		}catch(e){}
	}
	
	return this;

	}
	
})(jQuery);





	