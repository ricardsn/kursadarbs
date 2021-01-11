@extends('layout.mainlayout')
@section('content')
    <div class="container-fluid mt-100">
        <div class="row forum">
            <div class="col-md-12 forum-header">
                <div class="card mb-4">
                    <div class="card-header">
                       <h1 class="reservoir-header">{{ $reservoirForum->title }}</h1>
                    </div>
                    <div class="card-body">
                        {{ $reservoirForum->desc }}
                    </div>
                    <div class="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
                        <div class="fish-container" id="fish-container">
                            <button class="btn btn-success fish-button" id="show-more">Apskatīt zivis</button>
                            <ul class="fish-list" id="fish-list">
                                @foreach($fishes as $fish)
                                   <li class="fish row">
                                       <img class="mb-auto" src="{{ asset(sprintf('/images/fishes/%s', $fish->image))  }}" alt="fish image" style="width: 200px; height: 100px;">
                                       <a href="{{ sprintf('%s/fish/%s', \Illuminate\Support\Facades\URL::to('/'), $fish->id)  }}">{{ $fish->name }}</a>
                                   </li>
                                @endforeach
                            </ul>
                            <button class="btn btn-danger fish-button" id="show-less">Aizvērt</button>
                        </div>
                    </div>
                </div>
            </div>
            @auth
                <div class="comment-textarea">
                    <div class="alert alert-danger" id="comment-error"></div>
                    @csrf
                    <h3 class="comment-textarea-header">Pievienot komentāru:</h3>
                    <textarea name="comment-block" id="comment-block" cols="30" rows="10" class="form-control"></textarea>
                    <button id="publish-comment" class="btn-success btn">Publicēt</button>
                </div>
            @endauth
            <select class="mdb-select md-form btn btn-primary dropdown-toggle" id="order-selector">
                <option value="newest">Jaunākie -> vecākie</option>
                <option value="oldest">Vecākie -> Jaunākie</option>
            </select>
            <div id="comments" class="container"></div>
            <div class="forum-arrows">
                <div class="prev"><span class="icon"></span></div>
                <div id="pageCount"></div>
                <div class="next"><span class="icon"></span></div>
            </div>
        </div>
    </div>
    <script src="{{ asset('js/forum/comments.js')  }}"></script>
    <script src="{{ asset('js/forum/fish-listing.js')  }}"></script>
@endsection
<b></b>
