<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('points', function(Blueprint $table){
          $table->id();
          $table->unsignedBigInteger('receiver')->nullable();
          $table->foreign('receiver')
                ->references('id')
                ->on('students')
                ->onDelete('set null');
          $table->integer('total_points');
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('points');
    }
};
