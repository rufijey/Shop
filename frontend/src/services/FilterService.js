import api from "../api";
import axios from "axios";

export default class FilterService {
    static async getAll() {
        return await axios.get('/filters');
    }

    static async getSelected(filters) {
        return await axios.get('/filters/ids', {
            params: {
                category_id: filters.category_id,
                characteristic_ids: filters.characteristic_ids
            }
        });
    }
}