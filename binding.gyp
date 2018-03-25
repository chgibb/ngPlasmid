{
    "targets": [
        {
            "target_name": "ngPlasmid",
            "include_dirs": [
                "src",
                "<!(node -e \"require('nan')\")"
            ],
            "sources": [
                "lib/cpp/index.cpp"
            ],
            "cflags_cc" : [
                "-std=c++11",
                "-O3",
                "-ffast-math",
                "-Werror",
                "-Wno-comment",
                "-s"
            ],
            "msvs_settings" : {
                "VCCLCompilerTool" : {
                    "BasicRuntimeChecks" : "false",
                    "AdditionalOptions" : [
                        "/Ox",
                        "/fp:fast"
                    ]
                }
            }
        }
    ]
}