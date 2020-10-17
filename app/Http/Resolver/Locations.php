<?php
use App\Models\Map;

$data = [];
try {
    $data = Map::all();
    $data->toJson();
}
catch (\mysql_xdevapi\Exception $exception) {
    $data = [
        'status' => 'error',
        'message' => $exception
    ];
    $data->toJson();
}

return $data;
