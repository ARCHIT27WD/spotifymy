let currentsong= new Audio();
let songs;
let currfolder;

function secondsToMinutesSeconds(seconds) {
    // Ensure seconds is a non-negative integer
    seconds = Math.max(0, parseInt(seconds, 10));

    if(isNaN(seconds) || seconds < 0){
        return "00:00";
    }

    // Calculate minutes and remaining seconds
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    // Format the result as mm:ss
    const formattedTime = `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;

    return formattedTime;
}

async function getSongs(folder) {
    currfolder = folder;
    let a = await fetch(`https://spotifymy.netlify.app/${folder}/`)
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1])
        }

    }



    //show all songs in the playlists
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
    songUL.innerHTML = ""
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li> <img class="invert" src="img/music.svg" alt="">
        
                            <div class="info">
                                <div>${song.replaceAll("%20", " ")}</div>
                                <div>Song Artist</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;

    }
    //attach an event listener to each songs;
    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())

        })
    })
    
    return songs;

}

const playMusic = (track ,pause=false)=>{
    //let audio = new Audio("/songs/" + track);
    currentsong.src = `/${currfolder}/` + track
    if(!pause){
        currentsong.play()
        play.src = "img/pause.svg"
    }
   
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}



async function main() {

    
    //get the list of all songs
    await getSongs("songs/hindi")
    playMusic(songs[0],true)


    



    
    //attach event listner to next and play
    play.addEventListener("click",()=>{
        if(currentsong.paused){
            currentsong.play()
            play.src = "img/pause.svg"
        }
        else{
            currentsong.pause()
            play.src = "img/play.svg"
        }
    })

    //listen for timeupdate event

    currentsong.addEventListener("timeupdate",()=>{
        console.log(currentsong.currentTime,currentsong.duration);
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentsong.currentTime)}/${secondsToMinutesSeconds(currentsong.duration)}`
        document.querySelector(".circle").style.left = (currentsong.currentTime/currentsong.duration)*100 + "%"
    })
    
    //add an event listner to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent = (e.offsetX/e.target.getBoundingClientRect().width)*100;
        document.querySelector(".circle").style.left = percent+"%";
        currentsong.currentTime = ((currentsong.duration)*percent)/100;

       
    })

    //add an event listner for hameburger
    document.querySelector(".hameburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0"
    });

    // add event listner for close button
    
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-120%";
    });

    //event listener for previous

    previous.addEventListener("click",()=>{
        currentsong.pause()
        console.log("previous clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index-1)>=0){
            playMusic(songs[index-1])
        }

    })

    //event listener for next

    next.addEventListener("click",()=>{
        currentsong.pause()
        console.log("next clicked")
        let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0])
        if((index+1) < songs.length){
            playMusic(songs[index+1])
        }

    })

    //adjusting volume 
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log(e,e.target,e.target.value)
        currentsong.volume = parseInt(e.target.value)/100;
        if(currentsong.volume > 0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg","volume.svg")
           
        }
    })

    //add event listner to mute the volume

    document.querySelector(".volume>img").addEventListener("click",e=>{
        console.log(e.target)
        console.log("changing",e.target.src)
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg","mute.svg")
            currentsong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg","volume.svg")
            currentsong.volume = .10;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

    //load the playlist whenever card is clicked

    Array.from(document.getElementsByClassName("card")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)
            playMusic(songs[0]);
        })
    })



}
main() 