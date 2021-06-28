
/**
 * Generate a link to the HXL Proxy for C19 IATI data.
 *
 * Example:
 *
 *   let url = proxyLink("Health", "sector", "org+id", "commitments", false, true);
 *
 * Params:
 *   selectionValue - the primary value selected, based on selectionType (e.g. a sector name or an org id); use null for all
 *   selectionType - type of primary selection: "org+id", "sector", or "country" (ignored if selectionValue is null)
 *   isHumanitarian (optional) - if truthy, include only humanitarian transactions
 *   isStrict (optional) - if truthy, include only strict transactions
 */
function proxyLink (selectionValue, selectionType, isHumanitarian, isStrict) {
    // safety check: raise an exception if a token is not in the list of allowed values
    function checkToken (value, allowed, typeName) {
        if (!allowed.includes(value)) {
            throw "Bad " + typeName + ": " + value + ". Expected one of " + String(allowed);
        }
    }

    // the GET parameters that we'll pass to the HXL Proxy
    let params = {
        url: "https://ocha-dap.github.io/hdx-scraper-iati-viz/transactions.csv"
    };

    // filter rows by the primary selector (a single org, sector, or country)
    if (selectionValue !== null) {
        checkToken(selectionType, ["org+id", "country", "sector"], "selection type");
        params["filter01"] = "select";
        params["select-query01-01"] = selectionType + "=" + selectionValue;
    }

    // optionally filter by humanitarian status
    if (isHumanitarian) {
        params["filter02"] = "select";
        params["select-query02-01"] = "indicator+humanitarian=1";
    }

    // optionally filter by strictness
    if (isStrict) {
        params["filter03"] = "select";
        params["select-query03-01"] = "indicator+strict=1";
    }

    // aggregate the data
    params["filter04"] = "count";
    params["count-tags04"] = "org+id,org+name,org+type,sector,country,x_transaction_type";

    params["count-header04-01"] = "Net money (USD)";
    params["count-type04-01"] = "sum";
    params["count-pattern04-01"] = params["count-column04-01"] = "#value+net";
    
    params["count-header04-02"] = "Total money (USD)";
    params["count-type04-02"] = "sum";
    params["count-pattern04-02"] = params["count-column04-02"] = "#value+total";

    // remove rows with a value of 0
    params["filter05"] = "select";
    params["select-query05-01"] = "value>0";

    // sort the final result by transaction type, then by total value (largest to smallest)
    params["filter06"] = "sort";
    params["sort-tags06"] = "x_transaction_type,value+total";
    params["sort-reverse06"] = "on";

    // return the URL (change "data" to "data.csv" for a direct CSV download, without preview)
    return "https://proxy.hxlstandard.org/data?" + new URLSearchParams(params).toString();
}
