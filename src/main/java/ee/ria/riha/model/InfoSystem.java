package ee.ria.riha.model;

import com.fasterxml.jackson.annotation.JsonRawValue;
import lombok.*;


/**
 * Represents information system. Holds information system data as JSON.
 *
 * @author Valentin Suhnjov
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
public class InfoSystem {

    @JsonRawValue
    private String description;

    /**
     * Creates {@link ee.ria.riha.model.InfoSystem} with description data.
     *
     * @param description description
     */
    public InfoSystem(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
