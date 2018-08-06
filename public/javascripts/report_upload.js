
window.onload = function(){ 
    var fileUploader = document.getElementById('FileUploader'); 
    var pathDisplayer = document.getElementById('PathDisplayer'); 
    if(fileUploader.addEventListener){ 
    fileUploader.addEventListener('change', fileUploaderChangeHandler, false); 
    }else if(fileUploader.attachEvent){ 
    fileUploader.attachEvent('onclick', fileUploaderClickHandler); 
    }else{ 
    fileUploader.onchange = fileUploaderChangeHandler; 
    } 
    function fileUploaderChangeHandler(){ 
    pathDisplayer.value = fileUploader.value; 
    } 
    function fileUploaderClickHandler(){ 
    setTimeout(function(){ 
    fileUploaderChangeHandler(); 
    }, 0); 
    } 
    } 