<?php

use Illuminate\Auth\UserTrait;
use Illuminate\Auth\UserInterface;
use Illuminate\Auth\Reminders\RemindableTrait;
use Illuminate\Auth\Reminders\RemindableInterface;
use Illuminate\Database\Eloquent\SoftDeletingTrait;

class User extends BaseModel implements UserInterface, RemindableInterface {

	use UserTrait, RemindableTrait;

	// Soft Delete
    use SoftDeletingTrait;
    protected $dates = ['deleted_at'];

	/**
	 * The database table used by the model.
	 *
	 * @var string
	 */
	protected $table = 'users';	//not necessary because Laravel knows based on the class name, but it doesn't hurt anything

	/**
	 * The attributes excluded from the model's JSON form.
	 *
	 * @var array
	 */
	protected $hidden = array('password', 'remember_token');

	// rules for creating a user or logging in
	public static function updateRules ($id = 0, $merge = [])
	{
		return array_merge(
			[
				'first_name'            => 'required|alpha',
				'last_name'			    => 'alpha',
		        'email'                 => 'required|email|unique:users,email' . ($id ? ",$id" : ''),
		        'username'              => 'required|alpha_num|min:3|max:15|unique:users,username' . ($id ? ",$id" : '')
			],
			$merge);
	}

	public static $rules = [
		'first_name'            => 'required|alpha',
		'last_name'			    => 'alpha',
        'email'                 => 'required|email|unique:users,email',
        'username'              => 'required|alpha_num|min:3|max:15|unique:users,username',
        'password'              => 'required|min:8|max:50|confirmed',
        'password_confirmation' => 'required|min:8|max:50'
	];

	public static function boot()
	{
		parent::boot();

		static::deleting(function($user){
            foreach($user->stats as $stat)
            {
                $stat->delete();
            }
		});
	}

	// Mutator that stores all usernames as lower-case
	public function setUsernameAttribute($value)
	{
	    $this->attributes['username'] = strtolower($value);
	}

	// Mutator that hashes all passwords before storing
	public function setPasswordAttribute($value)
	{
	    $this->attributes['password'] = Hash::make($value);
	}

	// Define the relationship between a user and their stats
	public function stats()
	{
		// connects each user to their stats
		return $this->hasMany('Stat');
	}

	//get an array of all user's game times for particular size of puzzle
	public function bestTime($size)
	{
		$userBestTime = User::join('stats', 'stats.user_id', '=', 'users.id')
									->join('puzzles', 'puzzles.id', '=', 'stats.puzzle_id')
									->where('users.id', '=', $this->id)
									->where('size', '=', $size)
									->where('finished_game', '=', 1)
									->orderBy('game_time')
									->lists('game_time');

		//return value of first array element, or FALSE if the array is empty.
		return reset($userBestTime);

	}

	//get an array of all user's game moves for particular size of puzzle
	public function bestMoves($size)
	{
		$userBestMoves = User::join('stats', 'stats.user_id', '=', 'users.id')
								->join('puzzles', 'puzzles.id', '=', 'stats.puzzle_id')
								->where('users.id', '=', $this->id)
								->where('size', '=', $size)
								->where('finished_game', '=', 1)
								->orderBy('moves')
								->lists('moves');

		//return value of first array element, or FALSE if the array is empty.
		return reset($userBestMoves);

	}

	public function rankTime($size)
	{	//query an array of objects that contains all users' rankings organized by best times
		$rankings = User::join('stats', 'stats.user_id', '=', 'users.id')
							->join('puzzles', 'puzzles.id', '=', 'stats.puzzle_id')
							->where('size', '=', $size)
							->where('finished_game', '=', 1)
							->orderBy('game_time')
							->orderBy('stats.created_at')
							->select('users.id as _id' )
							->lists('_id');

		//loop through the array and find the first instance of the user
		foreach($rankings as $index => $user_id){
			if($user_id == $this->id) {
				return $index + 1;
			}
		}
		return false;
	}

	public function rankMoves($size)
	{	//query an array of objects that contains all users' rankings organized by least moves
		$rankings = User::join('stats', 'stats.user_id', '=', 'users.id')
							->join('puzzles', 'puzzles.id', '=', 'stats.puzzle_id')
							->where('size', '=', $size)
							->where('finished_game', '=', 1)
							->orderBy('moves')
							->orderBy('stats.created_at')
							->select('users.id as _id' )
							->lists('_id');

		//loop through the array and find the first instance of the user
		foreach($rankings as $index => $user_id){
			if($user_id == $this->id) {
				return $index + 1;
			}
		}
		return false;
	}
}



