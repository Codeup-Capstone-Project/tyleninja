@extends('layouts.master')

@section('title')
    <title>Profile | TyleNinja</title>
@stop

@section('content')
        <div class="pad-bot">
            <div class="row">
                <div class="col s12 m8 offset-m2 l8 offset-l2">
                    <div class="card z-depth-2 grey lighten-5">
                        <div class="card-content">
                            <div class="row no-marg-bot">
                                <div class="col s12">
                                    <h5 class="blue-grey-text text-darken-2">User Profile</h5>
                                </div>
                                <div class="col s12">
                                    <div class="user collection no-marg-top">
                                        <div class="col s12 l4">
                                            <img src="{{{ $user->profile_photo_url }}}" alt="" class="profile-avatar">
                                            <h6 class="user-title">{{{ Auth::user()->username }}}</h6>
                                        </div>
                                        <div class="col s12 l4 user-info-col">
                                            <p>{{{ $first_name }}} {{{ $last_name }}}</p>
                                            <p class="grey-text text-darken-1">{{{ Auth::user()->email }}}</p>
                                            <p class="grey-text">Joined {{{ Auth::user()->created_at }}}</p>
                                        </div>
                                        <div class="col s12 l4 user-info-col edit-profile-link">
                                            <a href="{{{ action('UsersController@getEdit', Auth::user()->username) }}}" class="teal-text text-lighten-1" id="edit-profile"><i class="mdi-editor-mode-edit"></i> Edit Account</a><br>
                                            <a href="#delete-account" class="modal-trigger blue-grey-text text-lighten-2"><i class="mdi-action-delete"></i> Delete Account</a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="section">
                                <div class="row no-marg-bot">
                                    <div class="col s12">
                                        <h5 class="blue-grey-text text-darken-2">Game Stats</h5>
                                    </div>
                                    <div class="col s12 l4">
                                        <div class="game collection no-marg-top">
                                            <div class="section outer-game-card">
                                                <span class="btn-floating puzzle-icon cyan darken-3"><i class="mdi-image-grid-on white-text"></i></span>
                                                <h6 class="puzzle-title cyan-text text-darken-3">3x3 Puzzle</h6>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Time Stats</h6>
                                                    <p class="grey-text text-darken-1">Best time: <span class="blue-grey-text">{{{ $userBestTime3x3 }}}</span></p>
                                                    <p class="grey-text text-darken-1">Current rank: <span class="blue-grey-text">{{{ $timeRank3x3 }}}</span></p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Move Stats</h6>
                                                    <p class="grey-text text-darken-1">Least moves: <span class="blue-grey-text">{{{ $userBestMoves3x3 }}}</span></p>
                                                    <p class="grey-text text-darken-1">Current rank: <span class="blue-grey-text">{{{ $movesRank3x3 }}}</span></p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <h6 class="leader-board-link">
                                                        <!-- Modal Trigger -->
                                                        <a id="size3x3" class="modal-trigger cyan-text text-darken-4" href="#leaderModal"><i class="mdi-action-swap-vert-circle"></i> Leader Board</a>
                                                    </h6>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <a class="btn menu waves-effect waves-light level cyan darken-3" href="{{{ action('GameController@getIndex', 3) }}}">Play</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col s12 l4">
                                        <div class="game collection no-marg-top">
                                            <div class="section outer-game-card">
                                                <span class="btn-floating puzzle-icon purple darken-3"><i class="mdi-image-grid-on white-text"></i></span>
                                                <h6 class="puzzle-title purple-text text-darken-3">4x4 Puzzle</h6>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Time Stats</h6>
                                                    <p class="grey-text text-darken-1">Best time: {{{ $userBestTime4x4 }}}</p>
                                                    <p class="grey-text text-darken-1">Current rank: {{{ $timeRank4x4 }}}</p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Move Stats</h6>
                                                    <p class="grey-text text-darken-1">Least moves: {{{ $userBestMoves4x4 }}}</p>
                                                    <p class="grey-text text-darken-1">Current rank: {{{ $movesRank4x4 }}}</p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <h6 class="leader-board-link">
                                                        <!-- Modal Trigger -->
                                                        <a id="size4x4" class="modal-trigger purple-text text-darken-4" href="#leaderModal"><i class="mdi-action-swap-vert-circle"></i> Leader Board</a>
                                                    </h6>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <a class="btn menu waves-effect waves-light level purple darken-3" href="{{{ action('GameController@getIndex', 4) }}}">Play</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col s12 l4">
                                        <div class="game collection no-marg-top">
                                            <div class="section outer-game-card">
                                                <span class="btn-floating puzzle-icon pink darken-3"><i class="mdi-image-grid-on white-text"></i></span>
                                                <h6 class="puzzle-title pink-text text-darken-3">5x5 Puzzle</h6>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Time Stats</h6>
                                                    <p class="grey-text text-darken-1">Best time: {{{ $userBestTime5x5 }}}</p>
                                                    <p class="grey-text text-darken-1">Current rank: {{{ $timeRank5x5 }}}</p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <div class="divider"></div>
                                                    <h6 class="medium">Move Stats</h6>
                                                    <p class="grey-text text-darken-1">Least moves: {{{ $userBestMoves5x5 }}}</p>
                                                    <p class="grey-text text-darken-1">Current rank: {{{ $movesRank5x5 }}}</p>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <h6 class="leader-board-link">
                                                        <!-- Modal Trigger -->
                                                        <a id="size5x5" class="modal-trigger pink-text text-darken-4" href="#leaderModal"><i class="mdi-action-swap-vert-circle"></i> Leader Board</a>
                                                    </h6>
                                                </div>
                                                <div class="section no-pad-bot">
                                                    <a class="btn menu waves-effect waves-light level pink darken-3" href="{{{ action('GameController@getIndex', 5) }}}">Play</a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    <!-- Delete Account Modal -->
    <div id="delete-account" class="modal">
        <div class="modal-content">
            <h4 class="blue-grey-text text-darken-2">Delete Account</h4>
            <p class="flow-text blue-grey-text"><span class="pink-text text-darken-2 normal">Are you sure?</span><br>All of your stats and leader board rankings will be lost.</p>
        </div>
        <div class="modal-footer">
            <a href="{{{ action('UsersController@getDestroy', Auth::user()->id) }}}" class="modal-action modal-close waves-effect waves-red btn-flat pink-text text-darken-3">Delete my account</a>
            <a href="#!" class="modal-action modal-close waves-effect waves-teal btn-flat teal-text">Go Back</a>
        </div>
    </div>

    <!-- Modal Structure -->
        <div id="leaderModal" class="modal bottom-sheet modal-fixed-footer grey lighten-5">
            <div id="leaderModalContent" class="modal-content">
                <div class="row">
                    <div class="col s12s">
                        <div class="preloader-wrapper active">
                            <div class="spinner-layer spinner-blue">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            <div class="spinner-layer spinner-red">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            <div class="spinner-layer spinner-yellow">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>

                            <div class="spinner-layer spinner-green">
                                <div class="circle-clipper left">
                                    <div class="circle"></div>
                                </div>
                                <div class="gap-patch">
                                    <div class="circle"></div>
                                </div>
                                <div class="circle-clipper right">
                                    <div class="circle"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <a href="#!" class="blue-grey-text text-darken-2 modal-action modal-close btn-flat">Close&nbsp;<i class="small mdi-navigation-cancel right"></i></a>
            </div>
      </div>
@stop
