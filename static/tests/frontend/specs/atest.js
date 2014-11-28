describe("File Menu Toolbar", function(){
  //create a new pad before each test run
  beforeEach(function(cb){
    helper.newPad(cb);
    this.timeout(60000);
  });

  // Create Pad
   // Check Highlighting text and setting it to bold works
     // Check Highlighting text and setting it to un-bold works

  it("Uses file menu to enable boldness", function(done) {
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $boldButton = chrome$(".dropdown-menu #bold > a");
    $boldButton.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first();

    // is there a <b> element now?
    var isBold = $newFirstTextElement.find("b").length === 1;

    //expect it to be bold
    expect(isBold).to.be(true);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });

  it("Uses file menu to disable boldness", function(done) {
    var inner$ = helper.padInner$;
    var chrome$ = helper.padChrome$;

    //get the first text element out of the inner iframe
    var $firstTextElement = inner$("div").first();

    //select this text element
    $firstTextElement.sendkeys('{selectall}');

    //get the bold button and click it
    var $boldButton = chrome$(".dropdown-menu #bold > a");
    $boldButton.click();

    //	click it again to disable boldness
    $boldButton.click();

    //ace creates a new dom element when you press a button, so just get the first text element again
    var $newFirstTextElement = inner$("div").first();

    // is there a <b> element now?
    var isBold = $newFirstTextElement.find("b").length === 1;

    //expect it to be bold
    expect(isBold).to.be(false);

    //make sure the text hasn't changed
    expect($newFirstTextElement.text()).to.eql($firstTextElement.text());

    done();
  });


});
