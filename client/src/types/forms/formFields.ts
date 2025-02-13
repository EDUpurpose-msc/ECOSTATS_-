import { land_1_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_1";
import { land_2_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_2";
import { land_3_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_3";
import { land_4_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_4";
import { land_5_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_5";
import { land_6_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_6";
import { land_7_gen_form_fields } from "../../components/Reports/Forms/Land/Land_Table_7";

import { forestry_1_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_1";
import { forestry_2_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_2";
import { forestry_3_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_3";
import { forestry_4_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_4";
import { forestry_5_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_5";
import { forestry_6_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_6";
import { forestry_7_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_7";
import { forestry_8_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_8";
import { forestry_9_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_9";
import { forestry_10_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_10";
import { forestry_24_gen_form_fields } from "../../components/Reports/Forms/Forestry/Forestry_Table_24";

import { biodiversity_2_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_2";
import { biodiversity_3_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_3";
import { biodiversity_4_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_4";
import { biodiversity_5_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_5";
import { biodiversity_6_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_6";
import { biodiversity_7_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_7";
import { biodiversity_8_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_8";
import { biodiversity_9_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_9";
import { biodiversity_10_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_10";
import { biodiversity_11_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_11";
import { biodiversity_12_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_12";
// import { biodiversity_13_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_13";
// import { biodiversity_14_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_14";
import { biodiversity_15_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_15";
import { biodiversity_16_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_16";
import { biodiversity_17_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_17";
// import { biodiversity_18_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_18";
import { biodiversity_19_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_19";
import { biodiversity_20_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_20";
import { biodiversity_21_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_21";
import { biodiversity_22_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_22";
import { biodiversity_23_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_23";
import { biodiversity_24_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_24";
import { biodiversity_25_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_25";
import { biodiversity_26_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_26";
import { biodiversity_27_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_27";
import { biodiversity_28_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_28";
import { biodiversity_29_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_29";
import { biodiversity_30_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_30";
import { biodiversity_31_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_31";
import { biodiversity_32_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_32";
import { biodiversity_33_gen_form_fields } from "../../components/Reports/Forms/Biodiversity/Biodiversity_Table_33";

import { FormEnum, Sector } from "./formNameEnum";

export const FormFieldsBySector = {
    [Sector.LAND] : {
        [FormEnum.LAND_1] : land_1_gen_form_fields,
        [FormEnum.LAND_2] : land_2_gen_form_fields,
        [FormEnum.LAND_3] : land_3_gen_form_fields,
        [FormEnum.LAND_4] : land_4_gen_form_fields,
        [FormEnum.LAND_5] : land_5_gen_form_fields,
        [FormEnum.LAND_6] : land_6_gen_form_fields,
        [FormEnum.LAND_7] : land_7_gen_form_fields,
    },

    [Sector.FORESTRY] : {
        [FormEnum.FORESTRY_1] : forestry_1_gen_form_fields,
        [FormEnum.FORESTRY_2] : forestry_2_gen_form_fields,
        [FormEnum.FORESTRY_3] : forestry_3_gen_form_fields,
        [FormEnum.FORESTRY_4] : forestry_4_gen_form_fields,
        [FormEnum.FORESTRY_5] : forestry_5_gen_form_fields,
        [FormEnum.FORESTRY_6] : forestry_6_gen_form_fields,
        [FormEnum.FORESTRY_7] : forestry_7_gen_form_fields,
        [FormEnum.FORESTRY_8] : forestry_8_gen_form_fields,
        [FormEnum.FORESTRY_9] : forestry_9_gen_form_fields,
        [FormEnum.FORESTRY_10] : forestry_10_gen_form_fields,
        [FormEnum.FORESTRY_24] : forestry_24_gen_form_fields,
    },

    [Sector.BIODIVERSITY] : {
        [FormEnum.BIODIVERSITY_2] : biodiversity_2_gen_form_fields,
        [FormEnum.BIODIVERSITY_3] : biodiversity_3_gen_form_fields,
        [FormEnum.BIODIVERSITY_4] : biodiversity_4_gen_form_fields,
        [FormEnum.BIODIVERSITY_5] : biodiversity_5_gen_form_fields,
        [FormEnum.BIODIVERSITY_6] : biodiversity_6_gen_form_fields,
        [FormEnum.BIODIVERSITY_7] : biodiversity_7_gen_form_fields,
        [FormEnum.BIODIVERSITY_8] : biodiversity_8_gen_form_fields,
        [FormEnum.BIODIVERSITY_9] : biodiversity_9_gen_form_fields,
        [FormEnum.BIODIVERSITY_10] : biodiversity_10_gen_form_fields,
        [FormEnum.BIODIVERSITY_11] : biodiversity_11_gen_form_fields,
        [FormEnum.BIODIVERSITY_12] : biodiversity_12_gen_form_fields,
        // [FormEnum.BIODIVERSITY_13] : biodiversity_13_gen_form_fields,
        // [FormEnum.BIODIVERSITY_14] : biodiversity_14_gen_form_fields,
        [FormEnum.BIODIVERSITY_15] : biodiversity_15_gen_form_fields,
        [FormEnum.BIODIVERSITY_16] : biodiversity_16_gen_form_fields,
        [FormEnum.BIODIVERSITY_17] : biodiversity_17_gen_form_fields,
        // [FormEnum.BIODIVERSITY_18] : biodiversity_18_gen_form_fields,
        [FormEnum.BIODIVERSITY_19] : biodiversity_19_gen_form_fields,
        [FormEnum.BIODIVERSITY_20] : biodiversity_20_gen_form_fields,
        [FormEnum.BIODIVERSITY_21] : biodiversity_21_gen_form_fields,
        [FormEnum.BIODIVERSITY_22] : biodiversity_22_gen_form_fields,
        [FormEnum.BIODIVERSITY_23] : biodiversity_23_gen_form_fields,
        [FormEnum.BIODIVERSITY_24] : biodiversity_24_gen_form_fields,
        [FormEnum.BIODIVERSITY_25] : biodiversity_25_gen_form_fields,
        [FormEnum.BIODIVERSITY_26] : biodiversity_26_gen_form_fields,
        [FormEnum.BIODIVERSITY_27] : biodiversity_27_gen_form_fields, 
        [FormEnum.BIODIVERSITY_28] : biodiversity_28_gen_form_fields,
        [FormEnum.BIODIVERSITY_29] : biodiversity_29_gen_form_fields,
        [FormEnum.BIODIVERSITY_30] : biodiversity_30_gen_form_fields,
        [FormEnum.BIODIVERSITY_31] : biodiversity_31_gen_form_fields,
        [FormEnum.BIODIVERSITY_32] : biodiversity_32_gen_form_fields,
        [FormEnum.BIODIVERSITY_33] : biodiversity_33_gen_form_fields  
    }


}

