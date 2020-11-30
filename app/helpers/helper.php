<?php
function isInList($fishList, $fishId) {
    foreach ($fishList as $fish) {
        if($fish->fish_id == $fishId) {
            return true;
        }
    }
    return false;
}
