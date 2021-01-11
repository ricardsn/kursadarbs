<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Reservoir extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'lat',
        'long',
        'type',
        'status'
    ];

    protected $primaryKey = 'id';

    public function fishes() //function that adds fishes to model
    {
        return $this->belongsToMany(Fish::class);
    }
}
