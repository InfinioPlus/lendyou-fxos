$(document).ready(function(){
    var primaryKeys;	// Stores Lends 
    databaseExists();
    getLends();

    $('.input-group.date').datepicker({
    });
    
    $('#new-lend').hide();
    
    $('#new-lend-btn').click(function(){
        $('#new-lend').slideToggle('slow');
    });
    
    $('#close-btn').click(function(){
        clearForm();
    });
    
    $('#lend-btn').click(function(){
		if($('#lendwhat-txt').val()!='' || $('#lendto-txt').val()!='' || $('#lendwhen-txt').val()!=''){
			addLend($('#lendwhat-txt').val(), $('#lendto-txt').val(), $('#lendwhen-txt').val());
			getLends();
		}
		else
			alert("Please enter a lend!");
    });
    
    function clearForm(){
        $('#lendwhat-txt').val('');
        $('#lendto-txt').val('');
        $('#lendwhen-txt').val('');
        $('#new-lend').slideToggle('slow');
    }
    
    function databaseExists(){
        var request = indexedDB.open('lendyou6');
 
        request.onupgradeneeded = function(e)
        {
            var idb = e.target.result;
            
                if (!idb.objectStoreNames.contains('lend'))
                {
                    var store = idb.createObjectStore('lend', {KeyPath: 'Id', autoIncrement: true});
                    store.createIndex('lendwhat', 'lendwhat', {unique: false});
                    store.createIndex('lendto', 'lendto', {unique: false});
                    store.createIndex('lendwhen', 'lndwhen', {unique: false});
                }
        }
    }
    
    function addLend(what, who, when){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
        
        var request = indexedDB.open('lendyou6');
 
        request.onsuccess = function(e)
        {
            var idb = e.target.result;
            var trans = idb.transaction('lend', IDBTransaction.READ_WRITE);
            var store = trans.objectStore('lend');
         
            var requestAdd = store.add({lendwhat: what, lendto: who, lendwhen: when});
         
            requestAdd.onsuccess = function(e) {
                alert('Lend added successfully');
                clearForm();
            };
         
            requestAdd.onfailure = function(e) {
                alert('Failed to add lend: ' + e);
            };
        };
    }
    
    function getLends(){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
        
        
        var html = '';
        
        var request = indexedDB.open('lendyou6');
        request.onsuccess = function(e)
        {
            primaryKeys = [];
            
            idb = e.target.result;
            var transaction = idb.transaction('lend', IDBTransaction.READ_ONLY);
            var objectStore = transaction.objectStore('lend');
         
            objectStore.openCursor().onsuccess = function(event)
            {
                var cursor = event.target.result;
                if (cursor)
                {
                    html += '<li class="list-group-item"> <a href="#">';
                    html += 'Lend my ' + cursor.value.lendwhat + ' to ' + cursor.value.lendto + ' on ' + cursor.value.lendwhen;
                    html += '<span class="pull-right"><span class="glyphicon glyphicon-remove"></span></span></a></li>';
                    primaryKeys.push(cursor.primaryKey);
                    cursor.continue();
                }
                else
                {
                    // we fall here when all entries are displayed
                     $('#lends-list').html(html);
                     
                     $('#lends-list li').click(function(){
                        var index = $(this).parent().children().index(this);
                        
                        var r = confirm('Are you sure you want to delete current record?');
                        if (r == true) {
                            deleteLend(primaryKeys[index]);
                            getLends();
                        }
                    });
                }
            };
        };
    }
    
    function deleteLend(index){
        var indexedDB = window.indexedDB || window.webkitIndexedDB || window.msIndexedDB;
        var IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange;
        var openCopy = indexedDB && indexedDB.open;
 
        var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction;
 
        if (IDBTransaction)
        {
            IDBTransaction.READ_WRITE = IDBTransaction.READ_WRITE || 'readwrite';
            IDBTransaction.READ_ONLY = IDBTransaction.READ_ONLY || 'readonly';
        }
    
        var request = indexedDB.open('lendyou6');
        request.onsuccess = function(e)
        {
            var idb = e.target.result;
            var objectStore = idb.transaction('lend', IDBTransaction.READ_WRITE).objectStore('lend');
            var request = objectStore.delete(index);
         
            request.onsuccess = function(ev)
            {
                console.log(ev);
            };
         
            request.onerror = function(ev)
            {
                console.log('Error occured', ev.srcElement.error.message);
            };
        };
    }
});