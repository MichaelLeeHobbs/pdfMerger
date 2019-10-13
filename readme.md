# pdfm - Simple PDF Merger
## Dependence
1. nodejs 
2. pdftk-server
 
## Setup
1. choco install pdftk-server nodejs
2. npm install -g pdfm

## Usage
1. pdfMerge --files files.pdfm --output JohnDoePackage.pdf
2. Optional: --bin full/path/to/pdftk
3. files.pdfm is list of pdf files; full path, to be merged in order list.
    * Example: files.pdfm
    * ```text
      P:\Documents\Physicians\Internship\JohnDoe\JohnDoe_Pennsylvania_GeneralSurgery_7-1-1996_6-30-1997.pdf
      P:\Documents\Physicians\Internship\JohnDoe\Internship\JohnDoe_MD_OhioUniversity_8-29-1996.pdf
      P:\Documents\Physicians\Internship\JohnDoe\Internship\JohnDoe_UnivCincinnati_7-1-1997_6-30-2001.pdf
      ```

## Notes
1. pdfm will copy files to the systems temp folder before attempting to call pdftk to merge the files. This is to avoid issues seen in pdftk when attempting to access files on a network store. pdfm should remove these files after completion but in the event of an unhandle error occurs files could be left in the systems temp folder.

## Changes
### 1.0.4
1. Fixed bug where pdfm was not using the temporary files as expected

## Future
1. Support linux without having to use --bin option
1. Fix test
1. _Maybe if I have time._ Daemon process to watch pdf files for changes then run a merge.
