@extends('layout.mainlayout')
@section('content')
    <div class="container-fluid mt-100">
        <div class="row">
            <div class="col-md-12">
                <div class="card mb-4">
                    <div class="card-header">
                       <h1 class="reservoir-header">{{  $reservoirForum->title }}</h1>
                    </div>
                    <div class="card-body">
                        {{ $reservoirForum->desc }}
                    </div>
                    <div class="card-footer d-flex flex-wrap justify-content-between align-items-center px-0 pt-0 pb-3">
                        ...
                    </div>
                </div>
            </div>
            <div class="comment-textarea">
                @csrf
                <textarea name="comment-block" id="comment-block" cols="30" rows="10" class="form-control"></textarea>
                <button id="publish-comment" class="btn-success btn">Publicēt</button>
            </div>
            <div id="comments" class="container"></div>
            <div class="prev">Atpakaļ</div>
            <div class="next">Uzpriekšu</div>
        </div>
    </div>
    <script src="{{ asset('js/forum/comments.js')  }}"></script>
@endsection
<b></b>
