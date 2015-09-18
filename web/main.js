import $ from 'jquery';
import can from 'can';
import 'js/components/lyme_main/lyme_main';
import appState from "appState";

$("#app").append(can.stache("<lyme-main class='fill-height fill-width' app-state='{.}'></lyme-main>")(appState));

