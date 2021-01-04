<div class="outer-nav">
    <nav class="navbar navbar-expand-lg navbar-light bg-light">
        <a class="navbar-brand" href="/">Makšķērēšanas klubs</a>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
        </button>

        <div class="collapse navbar-collapse" id="navbarSupportedContent">
            <ul class="navbar-nav mr-auto">
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('reservoir.index') }}">Karte</a>
                </li>
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdowns" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Ūdenstilpnes
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdowns">
                        <a class="dropdown-item" href="{{ route('show')  }}">Saraksts</a>
                        <a class="dropdown-item" href="{{ route('reservoir.create')  }}">Pievienot</a>
                    </div>
                </div>
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdowns" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Forumi
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdowns">
                        <a class="dropdown-item" href="{{ route('forum.index')  }}">Saraksts</a>
                        <a class="dropdown-item" href="{{ route('forum.create')  }}">Pievienot</a>
                    </div>
                </div>
                <div class="nav-item dropdown">
                    <a class="nav-link dropdown-toggle" id="navbarDropdowns" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        Zivis
                    </a>
                    <div class="dropdown-menu" aria-labelledby="navbarDropdowns">
                        <a class="dropdown-item" href="{{ route('fish.index')  }}">Saraksts</a>
                        <a class="dropdown-item" href="{{ route('fish.create')  }}">Pievienot</a>
                    </div>
                </div>
            </ul>
        </div>
        <ul class="navbar-nav ml-auto">
            <!-- Authentication Links -->
            @guest
                <li class="nav-item">
                    <a class="nav-link" href="{{ route('login') }}">{{ __('Ienākt') }}</a>
                </li>
                @if (Route::has('register'))
                    <li class="nav-item">
                        <a class="nav-link" href="{{ route('register') }}">{{ __('Reģistrēties') }}</a>
                    </li>
                @endif
            @else
                <li class="nav-item dropdown">
                    <a id="navbarDropdown" class="nav-link dropdown-toggle" href="#" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false" v-pre>
                        {{ Auth::user()->name }}
                    </a>

                    <div class="dropdown-menu dropdown-menu-right" aria-labelledby="navbarDropdown">
                        <a class="dropdown-item" href="{{ route('profile') }}">
                            {{ __('Apskatīt profilu') }}
                        </a>
                        <a class="dropdown-item" href="{{ route('editProfile') }}">
                            {{ __('Rediģēt profilu') }}
                        </a>
                        <a class="dropdown-item" href="{{ route('changePassword') }}">
                            {{ __('Mainīt paroli') }}
                        </a>
                        <a class="dropdown-item" href="{{ route('logout') }}"
                           onclick="event.preventDefault();
                                                     document.getElementById('logout-form').submit();">
                            {{ __('Iziet') }}
                        </a>

                        <form id="logout-form" action="{{ route('logout') }}" method="POST" class="d-none">
                            @csrf
                        </form>
                    </div>
                </li>
            @endguest
        </ul>
    </nav>
</div>
