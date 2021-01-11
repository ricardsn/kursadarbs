<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\File;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    /**
     * Function that renders user view
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function index() {
        if (!Auth::guest()) {
            $user = Auth::user();
            return view('auth.index', compact('user'));
        }

        return redirect()->route('login')->with('error', 'Lietotājs nav autorizēts..');
   }

    /**
     * Function for adding image to user
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addImage(Request $request): \Illuminate\Http\RedirectResponse
   {
       $request->validate([
           'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', //validating uploaded image
       ]);
       $imageName = time().'.'.$request->image->extension(); //renaming to unique
       $request->image->move(public_path('images/profile'), $imageName); //moving image with new name to public folder
       $user = Auth::user();
       $user->image = $imageName;
       $user->save(); //saving image name to user

       return back()
           ->with('success','Lietotājam tika pievienota bilde.')
           ->with('image',$imageName);
   }

    /**
     * Function for rendering password change view
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function changePassword() {
       if (!Auth::guest()) {
           $user = Auth::user();
           return view('auth.changePassword', compact('user'));
       }

       return redirect()->route('login');
   }

    /**
     * Function that saves new password
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveNewPassword(Request $request) {
        if (!Auth::guest()) {
            $user = Auth::user();

            if(!Hash::check($request->curr_password, $user->getAuthPassword())) { //checking if curr password is correct
                return redirect()->route('changePassword')->with('error','Nepareiza tagadēja parole.');
            }

            if (strlen($request->new_password) < 8) { //checking if new password meets requirements
                return redirect()->route('changePassword')->with('error','Jaunās paroles garums ir mazāks par 8.');
            }

            $user->password = Hash::make($request->new_password); //Hashing newly created password
            $user->save(); //saving new password

            return redirect()->route('changePassword')->with('success','Parole tika atjaunota.');
        }

        return redirect()->route('login');
   }

    /**
     * Function that returns all used emails except authorized users
     *
     * @return \Illuminate\Support\Collection
     */
    public function getEmails(): \Illuminate\Support\Collection
   {
       try {
           $emails = User::all()->where('email','!=',Auth::user()->email)->pluck('email');
           json_encode($emails);
       }
       catch (\mysql_xdevapi\Exception $exception) {
           $data = [
               'status' => 'error',
               'message' => $exception
           ];
           $emails->toJson();
       }
       return $emails;
   }

    /**
     * Function returns edit profile view
     *
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View|\Illuminate\Http\RedirectResponse
     */
    public function editProfile() {
        if (!Auth::guest()) {
            $user = Auth::user();
            return view('auth.edit', compact('user'));
        }

       return redirect()->route('login')->with('error', 'Lietotājs nav autorizēts..');
   }

    /**
     * Function for saving edit profile data
     *
     * @param Request $request
     */
    public function saveEditProfile(Request $request) {
       $imageName = null;
       $user = Auth::user();
       if($request->isImageChanged == 'true') {
           $request->validate([
               'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048', //validating image
           ]);
           $imageName = time().'.'.$request->image->extension(); //renaming to unique
           $request->image->move(public_path('images/profile'), $imageName); //moving to public folder
           $image_path = sprintf('%s\images\profile\%s', public_path(), $user->image);
           if(File::exists($image_path)) { //deletes previous profile image
               File::delete($image_path);
           }
       }

       $user_update = array(
           'name' => $request->name,
           'email' => $request->email
       );
       $user->update($user_update);
       $user->image = $imageName ? $imageName : $user->image;
       $user->save();
    }
}
