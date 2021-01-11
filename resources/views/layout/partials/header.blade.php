@if(session()->has('error'))
    <div class="alert alert-danger" style="max-width: 1440px; margin: auto">
        {{ session()->get('error')  }}
    </div>
@endif
@if(session()->has('error-array'))
    <div class="alert alert-danger" style="max-width: 1440px; margin: auto">
        @foreach(session()->get('error-array') as $error)
        {{ $error }} <br/>
        @endforeach
    </div>
@endif
@if(session()->has('success'))
    <div class="alert alert-success" style="max-width: 1440px; margin: auto">
        {{ session()->get('success')  }}
    </div>
@endif
<section class="jumbotron text-center">
    <div class="container">
        <h1 class="jumbotron-heading" id="main-header">Makšķerēšanas klubs</h1>
    </div>
</section>
<div id="js-errors" class="alert-danger" style="max-width: 1440px; margin: auto; text-align: center;"></div>
