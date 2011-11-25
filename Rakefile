# -*- mode: ruby; -*-
require "rubygems"
require "rake/testtask"

CLOSURE_ROOT_PATH = "~/closure-library/"
CLOSURE_DEP_SCRIPT_PATH = CLOSURE_ROOT_PATH + "closure/bin/build/depswriter.py"

TEST_PATH = "test/js"
SRC_PATH = "src/"

APP_FILE = "sudokill.js"
APP_DEP_FILE = "sudokill-dep.js"

DEPS_ROOT = "../../"
SRC_DEPS_PATH = DEPS_ROOT + "src"

namespace :build do
  task :all => [:test]

  desc "Build the js file for the app"
  task :app do
#    system("python #{CLOSURE_DEP_SCRIPT_PATH} --dep #{CLOSURE_ROOT_PATH} " +
#           "--path #{SRC_PATH} --output_mode deps > #{APP_DEP_FILE}")
    system("python #{CLOSURE_DEP_SCRIPT_PATH} --root_with_prefix=\"src #{SRC_DEPS_PATH}\" " +
           "> #{APP_DEP_FILE}")

    js_files = %w[move board]
    js_opt_arr = js_files.map { |file| "--js=#{SRC_PATH}/#{file}.js" }
    js_opt_str = js_opt_arr.join(" ")

    system("java -jar compiler.jar #{js_opt_str} --js_output_file=#{APP_FILE}")
  end

  desc "Build the test script"
  task :test => :app do
    system("python #{CLOSURE_DEP_SCRIPT_PATH} --dep #{CLOSURE_ROOT_PATH} " +
           "--path #{SRC_PATH}, #{TEST_PATH} --output_mode deps > test/test-deps.js")
  end
end

task :default do
  system("rake -T")
end

