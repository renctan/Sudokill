# -*- mode: ruby; -*-
require "rubygems"
require "rake/testtask"

CLOSURE_ROOT_PATH = "/usr/lib/closure-library/" # Modify this according to machine setup
CLOSURE_TOOLS_PATH = CLOSURE_ROOT_PATH + "closure/bin/build/"
CLOSURE_DEP_SCRIPT_PATH = CLOSURE_TOOLS_PATH + "depswriter.py"
CLOSURE_BUILDER_PATH = CLOSURE_TOOLS_PATH + "closurebuilder.py"
CLOSURE_LIB_PATH = "lib/goog/base.js"

TEST_PATH = "test/js"
SRC_PATH = "src/"

APP_FILE = "sudokill.js"
APP_DEP_FILE = "sudokill-dep.js"

DEPS_ROOT = "../../"
SRC_DEPS_PATH = DEPS_ROOT + "src"

desc "Build the js file for the app"
task :build do
  system("python #{CLOSURE_DEP_SCRIPT_PATH} --root_with_prefix=\"src #{SRC_DEPS_PATH}\" " +
         "> #{APP_DEP_FILE}")

  system("python #{CLOSURE_BUILDER_PATH} --root=#{CLOSURE_ROOT_PATH} --root=src "+
         "--namespace=drecco.sudokill.MainUI --output_mode=compiled " +
         "--compiler_jar=compiler.jar > #{APP_FILE}")
end

task :default do
  system("rake -T")
end

