$(document).ready(function(){
    $('.input-group.date').datepicker({
    });
    
    $('#new-lend').hide();
    
    $('#new-lend-btn').click(function(){
        $('#new-lend').show();
    });
    
    $('#close-btn').click(function(){
        $('#lendwhat-txt').val('');
        $('#lendto-txt').val('');
        $('#lendwhen-txt').val('');
        $('#new-lend').hide();
    });
    
    $('#lend-btn').click(function(){
        alert('test');
    });
});