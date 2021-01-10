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
     * @return \Illuminate\Contracts\Foundation\Application|\Illuminate\Contracts\View\Factory|\Illuminate\Contracts\View\View
     */
    public function index() {
        if (!Auth::guest()) {
            $user = Auth::user();
            return view('auth.index', compact('user'));
        }

        return redirect()->route('login')->with('error', 'Lietotājs nav autorizēts..');
   }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function addImage(Request $request): \Illuminate\Http\RedirectResponse
   {
       $request->validate([
           'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
       ]);
       $imageName = time().'.'.$request->image->extension();
       $request->image->move(public_path('images/profile'), $imageName);
       $user = Auth::user();
       $user->image = $imageName;
       $user->save();

       return back()
           ->with('success','Lietotājam tika pievienota bilde.')
           ->with('image',$imageName);
   }

   public function changePassword() {
       if (!Auth::guest()) {
           $user = Auth::user();
           return view('auth.changePassword', compact('user'));
       }

       return redirect()->route('login');
   }

    /**
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function saveNewPassword(Request $request) {
        if (!Auth::guest()) {
            $user = Auth::user();

            if(!Hash::check($request->curr_password, $user->getAuthPassword())) {
                return redirect()->route('changePassword')->with('error','Nepareiza tagadēja parole.');
            }

            if (strlen($request->new_password) < 8) {
                return redirect()->route('changePassword')->with('error','Jaunās paroles garums ir mazāks par 8.');
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            return redirect()->route('changePassword')->with('success','Parole tika atjaunota.');
        }

        return redirect()->route('login');
   }

   public function getEmails() {
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

   public function editProfile() {
        if (!Auth::guest()) {
            $user = Auth::user();
            return view('auth.edit', compact('user'));
        }

       return redirect()->route('login')->with('error', 'Lietotājs nav autorizēts..');
   }

   public function saveEditProfile(Request $request) {
       $imageName = null;
       $user = Auth::user();
       if($request->isImageChanged == 'true') {
           $request->validate([
               'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
           ]);
           $imageName = time().'.'.$request->image->extension();
           $request->image->move(public_path('images/profile'), $imageName);
           $image_path = sprintf('%s\images\profile\%s', public_path(), $user->image);
           if(File::exists($image_path)) {
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
