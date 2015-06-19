$(document).ready(function(){
    if(('mozApps' in navigator) && !(navigator.userAgent.indexOf('Firefox') > -1 && navigator.userAgent.indexOf("Mobile") > -1)) {
        var manifest_url = location.href + 'manifest_desktop/manifest_desktop.webapp';
        var installCheck = navigator.mozApps.checkInstalled(manifest_url);
        
        installCheck.onsuccess = function() {
            if(installCheck.result) {
                $('#install-row').hide();
            } else {
                $('#install-btn').click(function(ev){
                    ev.preventDefault();
                    
                    var installLocFind = navigator.mozApps.install(manifest_url);
                    
                    installLocFind.onsuccess = function(data) {};
                    
                    installLocFind.onerror = function() {
                        alert(installLocFind.error.name);
                    };
                });
            };
        };
    } else{
        $('#install-row').hide();
    }
});