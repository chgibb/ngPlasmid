{
    "targets": [
        {
            "target_name": "ngPlasmid",
            "include_dirs": [
                "src",
                "<!(node -e \"require('nan')\")"
            ],
            "sources": [
                "lib/index.cpp"
            ],
            "cflags_cc" : [
                "-std=c++11",
                "-O3",
                "-Werror"
            ]
        }
    ]
}