install.packages(
    c('repr', 'IRdisplay', 'crayon', 'pbdZMQ', 'devtools'),
    repos="{{r_mirror_url}}",  # https://mirrors.ebi.ac.uk/CRAN/
    lib="{{r_lib_directory}}"  # /usr/local/lib/R/site-library
)

devtools::install_github('IRkernel/IRkernel')

# register the jupyterhub R kernel ("user=F" for system-wide)
IRkernel::installspec(user=F)
