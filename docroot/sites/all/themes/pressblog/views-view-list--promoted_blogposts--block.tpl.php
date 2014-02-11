<div id="slider">

    <div id="slideshow">
    <?php foreach ($rows as $id => $row){ ?>
   
    <div class="slider-item"> 
        <?php print $row; ?>
    </div>
    
    <?php } ?>
    </div>
    
    <div id="controls">
        <div><a id="prev" href="">Prev</a></div>
        <div><a id="next" href="">Next</a></div>
    </div>
    
</div>