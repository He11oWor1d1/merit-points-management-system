<?php

namespace Database\Factories;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Model>
 */
class TeachersFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
          'name' => fake()->lastName(),
          'email' => fake()->unique()->safeEmail(), 
          'password' => Hash::make('teacherPassword'), 
          'description' => $this->faker->sentence, 
          'profile_pic' => "", 
        ];
    }
}
