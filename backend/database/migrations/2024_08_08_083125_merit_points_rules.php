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
        Schema::create('merit_points_rules', function(Blueprint $table){
          $table->id();
          $table->string("name");
          $table->string("description");
          $table->integer("points");
          $table->enum('operation_type', ["add", "deduct"]);
          $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
      Schema::dropIfExists('merit_points_rules');
    }
};
