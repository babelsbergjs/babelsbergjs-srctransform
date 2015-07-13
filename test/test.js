var should = require("should")
var BabelsbergSrcTransform = require("../src/src_transform");

//'lively.TestFramework'
//'users.timfelgentreff.standalone.Compressor'


describe('bbb_src_transform', function() {
  describe('transformation', function() {
    it('transforms prolog rule with quotes.', function() {
        var src = "rule: 'abs(N,N) |- N>=0'";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("bbb.rule(\"abs(N,N):-N>=0\");");
    });

    it('transforms prolog rule with braces.', function () {
        var src = "rule: { abs(N,N) |- N>=0 }";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("bbb.rule(\"abs(N,N):-N>=0\");");
    });

    it('transforms name in always.', function () {
        var src = "always: {name: c; a < b}";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("c=bbb.always({ctx:{c:c,a:a,b:b,_$_self:this.doitContext||this}},function(){returna<b;;});");
    });

    it('transforms store in always.', function () {
        var src = "always: {store: c; a < b}";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("c=bbb.always({ctx:{c:c,a:a,b:b,_$_self:this.doitContext||this}},function(){returna<b;;});");
    });

    it('transforms simple comparison.', function () {
        var src = "always: {a < b}";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("bbb.always({ctx:{a:a,b:b,_$_self:this.doitContext||this}},function(){returna<b;;});");
    });

    it('transforms comparison with priority.', function () {
        var src = "always: {solver: cassowary; priority: 'high'; a < b}";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("bbb.always({solver:cassowary,priority:\"high\",ctx:{cassowary:cassowary,a:a,b:b,_$_self:this.doitContext||this}},function(){returna<b;;});");
    });

    it('transforms trigger.', function () {
        var src = "var c = when(function() {a < b}).trigger(function () { alert });";
        var result = new BabelsbergSrcTransform().transform(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("varc=bbb.when({ctx:{a:a,b:b,_$_self:this.doitContext||this}},function(){returna<b;;}).trigger(function(){alert;});");
    });

    it('transforms invariant true.', function () {
        var src = "always: { true }\n\
                    var late;\n";
        var result = new BabelsbergSrcTransform().transform(src);
        // asserts correct indenting, too
        result.should.be.exactly("bbb.always({\n" +
                               "    ctx: {\n" +
                               "        _$_self: this.doitContext || this\n" +
                               "    }\n" +
                               "}, function() {\n" +
                               "    return true;;\n" +
                               "});\n" +
                               "\n" +
                               "var late;");
    });

    it('adds script.', function() {
        var src = "this.addScript(function () { foo })";
        var result = new BabelsbergSrcTransform().transformAddScript(src);
        result = result.replace(/[ \n\r\t]/g,"");
        result.should.be.exactly("this.addScript(function(){foo;},\"function(){foo}\");");
    });
  });
});
